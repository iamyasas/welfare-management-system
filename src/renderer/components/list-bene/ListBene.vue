<template>
  <div class="container">
    <br />
    <br />
    <br />
    <br />
    <div class="modal" :class="{ 'is-active': isOnboard }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Pick the Onboard date</p>
        </header>
        <section class="modal-card-body">
          <div class="columns is-centered">
            <button ref="calendarTrigger" type="button">
              Change
            </button>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div class="container">
            <div class="columns is-centered">
              <button class="button is-link" @click="onboardBeneficiary">
                Onboard
              </button>
              <button class="button" @click="isOnboard = false">Cancel</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
    <div class="columns">
      <div class="column">Total : {{ totalBeneficiaries }}</div>
      <div class="column" style="text-align:center">
        Active : {{ activeBeneficiaries }} / {{ maxActiveBeneficiaries }}
      </div>
      <div class="column" style="text-align:right">
        <router-link to="/add" class="button is-link"
          >Add Beneficiary</router-link
        >
      </div>
    </div>
    <br />
    <div class="field has-addons">
      <div class="control">
        <div class="select">
          <select v-model="searchType">
            <option>Card No</option>
            <option>Full name</option>
          </select>
        </div>
      </div>
      <div class="control is-expanded has-icons-right">
        <input
          class="input"
          type="text"
          v-model="searchText"
          @keyup.enter="loadBeneficiaries"
          placeholder="Search beneficiaries"
        />
        <span class="icon is-small is-right">
          <i class="fas fa-search"></i>
        </span>
      </div>
    </div>

    <br />
    <table class="table is-bordered is-fullwidth">
      <thead>
        <th>Card No</th>
        <th>Full name</th>
        <th>Address</th>
        <th>GND</th>
        <th>Post office</th>
        <th>Telephone</th>
        <th>Status</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="bene in beneficiaries">
          <td>{{ bene.key }}</td>
          <td>{{ bene.value.fullName }}</td>
          <td>{{ bene.value.address }}</td>
          <td>{{ bene.value.gnd }}</td>
          <td>{{ bene.value.postOffice }}</td>
          <td>{{ bene.value.telephone }}</td>
          <td>{{ bene.value.status }}</td>
          <td>
            <button
              class="button is-outlined is-small is-primary"
              data-tooltip="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              :disabled="bene.value.status === 'Active'"
              class="button is-outlined is-small is-link"
              data-tooltip="Onboard"
              @click="clickOnboard(bene.key)"
            >
              <i class="fas fa-sign-in-alt"></i>
            </button>
            <button
              class="button is-outlined is-small is-success"
              data-tooltip="Transfer"
            >
              <i class="fas fa-exchange-alt"></i>
            </button>
            <button
              class="button is-danger is-outlined is-small"
              data-tooltip="Death"
            >
              <i class="fas fa-skull-crossbones"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";
import moment from "moment/moment.js";
let database = firebase.database();

export default {
  name: "list-bene",
  data() {
    return {
      beneficiaries: [],
      totalBeneficiaries: "",
      activeBeneficiaries: "",
      maxActiveBeneficiaries: "",
      searchText: "",
      searchType: "Card No",
      allBeneficiariesEvent: null,
      selectedBeneCardNo: "",
      isOnboard: false,
      onBoardDate: moment().format("YYYY-MM-DD"),
    };
  },
  computed: {},
  methods: {
    loadBeneficiaries() {
      let beneficiaries = database.ref("users");
      var vuevm = this;

      //if there is no search text
      if (this.searchText == "") {
        this.allBeneficiariesEvent = beneficiaries.on("value", function(
          snapshot
        ) {
          vuevm.beneficiaries = [];
          vuevm.activeBeneficiaries = 0;
          snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val().status === "Active") {
              vuevm.activeBeneficiaries++;
            }
            vuevm.beneficiaries.push({
              key: childSnapshot.key,
              value: childSnapshot.val(),
            });
          });

          vuevm.totalBeneficiaries = vuevm.beneficiaries.length;
        });
        return;
      }
      //switch off event
      beneficiaries.off("value", this.allBeneficiariesEvent);

      if (this.searchType === "Card No") {
        beneficiaries
          .orderByKey()
          .equalTo(this.searchText)
          .once("value")
          .then(function(snapshot) {
            vuevm.beneficiaries = [];
            snapshot.forEach(function(childSnapshot) {
              vuevm.beneficiaries.push({
                key: childSnapshot.key,
                value: childSnapshot.val(),
              });
            });
          });
      } else if (this.searchType === "Full name") {
        beneficiaries
          .orderByChild("fullName")
          .once("value")
          .then(function(snapshot) {
            vuevm.beneficiaries = [];
            snapshot.forEach(function(childSnapshot) {
              if (
                childSnapshot
                  .val()
                  .fullName.toLowerCase()
                  .includes(vuevm.searchText.toLowerCase())
              ) {
                vuevm.beneficiaries.push({
                  key: childSnapshot.key,
                  value: childSnapshot.val(),
                });
              }
            });
          });
      }
    },
    loadMaxActiveBeneficiaries() {
      let configs = database.ref("configs/max-active-beneficiaries");
      var vuevm = this;

      configs.on("value", function(snapshot) {
        vuevm.maxActiveBeneficiaries = snapshot.val();
      });
    },
    clickOnboard(cardNo) {
      this.isOnboard = true;
      this.selectedBeneCardNo = cardNo;
    },
    findBene(bene) {
      return bene.key === this.selectedBeneCardNo;
    },
    onboardBeneficiary() {
      console.log(this.selectedBeneCardNo);
      console.log(this.onBoardDate);

      let bene = this.beneficiaries.find(this.findBene).value;
      bene.status = "Active";

      let userRef = database.ref("users/" + this.selectedBeneCardNo);
      userRef.set(bene);

      this.isOnboard = false;
    },
  },
  beforeCreate() {
    //console.log("beforeCreate");
  },
  created() {
    //console.log("created");
    this.loadBeneficiaries();
    this.loadMaxActiveBeneficiaries();
  },
  beforeMount() {
    //console.log("beforeMount");
  },
  mounted() {
    //console.log("mounted");
    var calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
      type: "date",
      isRange: false,
      startDate: moment().format("YYYY-MM-DD"),
      dateFormat: "YYYY-MM-DD",
      showFooter: "false",
      showButtons: "false",
      displayMode: "inline",
      color: "link",
    })[0];

    calendar.on("select", (e) => {
      this.onBoardDate = moment(e.data.startDate).format("YYYY-MM-DD");
    });
  },
  beforeUpdate() {
    //console.log("beforeUpdate");
  },
  updated() {
    //console.log("updated");
  },
  beforeDestroy() {
    //console.log("beforeDestroy");
  },
  destroyed() {
    //console.log("destroyed");
  },
};
</script>
<style>
.tooltip .tooltiptext {
  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
