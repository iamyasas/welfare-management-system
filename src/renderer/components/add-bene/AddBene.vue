<template>
  <div class="container">
    <br />
    <br />
    <br />
    <br />
    <h1 class="title is-3">Add Beneficiary</h1>
    <br />

    <div class="field">
      <label class="label">Transfer in</label>
      <div class="control">
        <label class="radio">
          <input
            type="radio"
            name="transfer"
            value="false"
            v-model="transfer"
            checked
          />
          No
        </label>
        <label class="radio">
          <input type="radio" name="transfer" value="true" v-model="transfer" />
          Yes
        </label>
      </div>
    </div>

    <div class="field">
      <label class="label">Card No</label>
      <div class="control">
        <input
          v-model="cardNo"
          class="input"
          type="text"
          placeholder="BGV XXX"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Full name</label>
      <div class="control">
        <input
          v-model="fullName"
          class="input"
          type="text"
          placeholder="John Doe"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Address</label>
      <div class="control">
        <input
          v-model="address"
          class="input"
          type="text"
          placeholder="302B/25, Walauwaththa, Raigama, Bandaragama"
        />
      </div>
    </div>

    <label class="label">ID</label>
    <div class="field has-addons">
      <div class="control">
        <div class="select">
          <select v-model="idType">
            <option v-for="idType in idTypes" :key="idType.key">
              {{ idType.value }}
            </option>
          </select>
        </div>
      </div>
      <div class="control is-expanded">
        <input
          v-model="id"
          class="input"
          type="text"
          placeholder="882850676v"
        />
      </div>
    </div>

    <label class="label">Birthday</label>
    <div class="field has-addons">
      <div class="control is-expanded">
        <button ref="calendarTrigger" type="button">Change</button>
      </div>
      <div class="control">
        <input class="input" type="text" :value="this.age" disabled />
      </div>
      <div class="control">
        <a class="button is-static">
          Years
        </a>
      </div>
    </div>

    <div class="field">
      <label class="label">GND</label>
      <div class="control">
        <div class="select">
          <select v-model="gnd">
            <option v-for="gnd in gnds" :key="gnd.key">
              {{ gnd.value }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Post office</label>
      <div class="control">
        <div class="select">
          <select v-model="postOffice">
            <option v-for="postOffice in postOffices" :key="postOffice.key">
              {{ postOffice.value }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">Telephone</label>
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="0711234567"
          v-model="telephone"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Amount(Rs.)</label>
      <div class="control">
        <input class="input" type="text" v-model="amount" disabled />
      </div>
    </div>

    <div class="field">
      <label class="label">Status</label>
      <div class="control">
        <label class="radio">
          <input
            type="radio"
            name="status"
            value="Active"
            v-model="status"
            checked
          />
          Active
        </label>
        <label class="radio">
          <input type="radio" name="status" value="Pending" v-model="status" />
          Pending
        </label>
      </div>
    </div>

    <section class="hero">
      <div class="hero-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" name="hasNominee" v-model="hasNominee" />
              Nominee
            </label>
          </div>
        </div>
        <template v-if="hasNominee">
          <div class="field">
            <label class="label">Full name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="John Doe"
                v-model="nominee.fullName"
              />
            </div>
          </div>

          <label class="label">ID</label>
          <div class="field has-addons">
            <div class="control">
              <div class="select">
                <select v-model="nominee.idType">
                  <option v-for="idType in idTypes" :key="idType.key">
                    {{ idType.value }}
                  </option>
                </select>
              </div>
            </div>
            <div class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="882850676v"
                v-model="nominee.id"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Telephone</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="0711234567"
                v-model="nominee.telephone"
              />
            </div>
          </div>
        </template>
      </div>
    </section>

    <div class="field is-grouped">
      <div class="control">
        <button @click="save" class="button is-link">Add</button>
      </div>
      <div class="control">
        <router-link to="/" class="button is-link is-light">Cancel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import bulmaCalendar from "bulma-calendar/dist/js/bulma-calendar.min.js";
import moment from "moment/moment.js";
let database = firebase.database();

export default {
  name: "add-bene",
  data() {
    return {
      transfer: false,
      cardNo: "",
      fullName: "",
      address: "",
      idTypes: [],
      idType: "National",
      id: "",
      birthday: moment()
        .subtract(120, "years")
        .format("YYYY-MM-DD"),
      gnds: [],
      gnd: "656 Raigama South",
      postOffices: [],
      postOffice: "Bandaragama",
      telephone: null,
      amount: "",
      status: "Active",
      hasNominee: false,
      nominee: {
        fullName: "",
        idType: "National",
        id: "",
        telephone: "",
      },
    };
  },
  computed: {
    age() {
      return moment().diff(this.birthday, "years");
    },
  },
  beforeCreate() {
    var vuevm = this;

    let idTypes = database.ref("id-types");
    idTypes.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        vuevm.idTypes.push({
          key: childSnapshot.key,
          value: childSnapshot.val(),
        });
      });
    });

    let postOffices = database.ref("post-offices");
    postOffices.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        vuevm.postOffices.push({
          key: childSnapshot.key,
          value: childSnapshot.val(),
        });
      });
    });

    let gnds = database.ref("gnd");
    gnds.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        vuevm.gnds.push({
          key: childSnapshot.key,
          value: childSnapshot.val(),
        });
      });
    });
  },
  created() {
    this.loadBeneficiaryPayment();
  },
  mounted() {
    var calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
      type: "date",
      isRange: false,
      startDate: moment()
        .subtract(120, "years")
        .format("YYYY-MM-DD"),
      minDate: moment()
        .subtract(120, "years")
        .format("YYYY-MM-DD"),
      maxDate: moment()
        .subtract(70, "years")
        .format("YYYY-MM-DD"),
      dateFormat: "YYYY-MM-DD",
      showFooter: "false",
      showButtons: "false",
      //displayMode: "inline",
      color: "link",
    })[0];

    calendar.on("select", (e) => {
      this.birthday = moment(e.data.startDate).format("YYYY-MM-DD");
    });
  },
  methods: {
    save() {
      console.log(this.transfer);
      console.log(this.fullName);
      console.log(this.address);
      console.log(this.idType);
      console.log(this.id);
      console.log(this.birthday);
      console.log(this.gnd);
      console.log(this.postOffice);
      console.log(this.telephone);
      console.log(this.amount);
      console.log(this.status);

      //if trasfer increment total count by one
      if (this.transfer) {
        //TODO
      }

      //check nominee
      let nominee = this.hasNominee ? this.nominee : null;

      //TODO: check if user already exists and throw an error.

      //add/edit user
      let userRef = database.ref("users/" + this.cardNo);
      userRef.set({
        fullName: this.fullName,
        address: this.address,
        idTypes: this.idType,
        id: this.id,
        birthday: this.birthday,
        gnd: this.gnd,
        postOffice: this.postOffice,
        telephone: this.telephone,
        amount: this.amount,
        status: this.status,
        nominee: nominee,
      });

      this.$router.push("/");
    },
    loadBeneficiaryPayment() {
      let configs = database.ref("configs/beneficiary-payment");
      var vuevm = this;

      configs.on("value", function(snapshot) {
        vuevm.amount = snapshot.val();
      });
    },
  },
};
</script>

<style></style>
