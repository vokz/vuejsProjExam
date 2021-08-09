<template>
    <div>
      <b-table-simple small caption-top stacked>
        <caption  class="text-right">
            <b-button-group>
            <b-button variant="success" @click="updateState(updateStats)">Update</b-button>
            <b-button variant="info" @click="changeFavorite(person.id,person.favorite)">{{ person.favorite ? 'Remove from Favorites' : 'Add to Favorites'}}</b-button>
            <b-button variant="danger" @click="deletePerson(person.id)">Delete</b-button>
            </b-button-group>
        </caption>
        <colgroup><col><col></colgroup>
        <colgroup><col><col><col></colgroup>
        <colgroup><col><col></colgroup>
        <b-tbody>
          <b-tr>
            <b-th rowspan="3" class="text-center">Contact Info</b-th>

            <b-td stacked-heading="Firstname" class="text-left">
              <div v-if="!updateStats">
                {{ person.first_name }}
              </div>
              <b-form-input v-model="payload.first_name " placeholder="Enter first name" v-if="updateStats"></b-form-input>
            </b-td>

            <b-td stacked-heading="Lastname" class="text-left">
              <div v-if="!updateStats">
                {{ person.last_name }}
              </div>
              <b-form-input v-model="payload.last_name " placeholder="Enter last name" v-if="updateStats"></b-form-input>
            </b-td>

            <b-td stacked-heading="Phone Number" class="text-left">
              <div v-if="!updateStats">
                {{ person.phone_number }}
              </div>
              <b-form-input v-model="payload.phone_number " placeholder="Enter phone number" v-if="updateStats"></b-form-input>
            </b-td>

            <b-td stacked-heading="Phone Code" class="text-left">
              <div v-if="!updateStats">
                {{ person.dial_code }}
              </div>
              <div v-if="updateStats">
                {{ this.selected.dial_code }}
              </div>
            </b-td>

            <b-td stacked-heading="Complete Number" class="text-left">{{ person.dial_code }}{{ person.phone_number }}</b-td>

            <b-td stacked-heading="Country" class="text-left" id="countryOptions">
              <div v-if="!updateStats">
                <img :src="'https://www.countryflags.io/' +  person.code  + '/shiny/16.png'" alt="" class="flag"> {{ person.country }}
              </div>

              <div v-if="updateStats">
                <img :src="'https://www.countryflags.io/' + this.selected.code +'/shiny/32.png'" alt="" class="flag">
                <v-select :options="options" label="name" @input="getSelected" :value="this.selected.name">
                  <template slot="option" slot-scope="option">
                    <img :src="'https://www.countryflags.io/' + option.code +'/shiny/16.png'" alt="" class="flag">
                      {{ option.name }}
                  </template>
                </v-select>
              </div>
            </b-td>
            <b-td stacked-heading="Date Created" class="text-left">{{ timeConvert(person.created_at) }}</b-td>
            <b-td class="text-right" v-if="updateStats"><b-button variant="success">Save Info</b-button> <b-button @click="cancelUpdate()">Cancel</b-button></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>

      <!-- Modal Confirm -->
      <b-modal id="confirm">{{ confirmMessage }}</b-modal>
    </div>
</template>

<script>
import _ from 'lodash';
import stateMixins from '../mixins/stateManagement'
import globalFunctions from '../mixins/globalFunctions'
import {CountryCode} from '../classes/enums/CountryCodes'

export default {
  name: 'ContactInfo',
  data(){
      return {
          person: [],
          confirmMessage: '',
          updateStats: false,
          payload:{
            id:0,
            first_name: '',
            last_name: '',
            phone_number: '',
            dial_code:'',
            code:'',
            country:'',
            created_at: '',
            favorite: false
          },
          options: [],
          selected:{
            code: '',
            dial_code:'',
            name:''
          }
      }
  },

  methods:{
    confirm(id) {
        this.$bvModal.msgBoxConfirm(this.confirmMessage, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if(value){
              this.deleteContact(id)
              this.$router.push({ path: '/' })
            }
          })
          .catch(err => {
            // An error occurred
          })
    },

    deletePerson(id){
      this.confirmMessage = "Are you sure you want to delete this contact person?"
      this.confirm(id)
    },

    updateState(stats){
      if(stats){
        this.discardChanges()
      }

      this.updateStats = stats ? false : true
    },

    cancelUpdate(){
      if(this.updateStats){
        this.discardChanges()
      }

      this.updateStats = false
    },

    discardChanges(){
      this.confirmMessage = "Discard changes?"
    },

    getSelected(val){
      this.selected = val
    }
  },

  created(){
      this.person = this.dataItems.find(obj => {
          return obj.id == this.$route.params.contact_id
      })
  },

  async mounted(){
    this.options = CountryCode

    // this.payload = [{
    //         id:'',
    //         first_name: '',
    //         last_name: '',
    //         phone_number: '',
    //         dial_code:'',
    //         code:'',
    //         country:'',
    //         created_at: '',
    //         favorite: false
    // }]
  },

  mixins: [stateMixins, globalFunctions]
}
</script>

<style scoped>
.flag{
    position: relative;
    bottom: 1px;
}

#countryOptions select{
  max-width: 300px;
}

#countryOptions .dropdown {
  display: inline-block;
  max-width: 300px;
  width: 100%;
}

#countryOptions .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1)
}

#countryOptions .dropdown li:last-child {
  border-bottom: none;
}

#countryOptions .dropdown li a {
  padding: 10px 20px;
  display: flex;
  width: 100%;
  align-items: center;
  font-size: 1.25em;
}

#countryOptions .dropdown li a .fa {
  padding-right: 0.5em;
}

 /*prevent bootstrap-vue css conflict*/
.v-select.dropdown .dropdown-toggle::after {
content: normal!important;
}
.v-select.dropdown .form-control {
height: inherit;
}
</style>