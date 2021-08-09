<template>
    <b-container>
        <b-row>
          <b-col cols="6">
            <b-input-group prepend="Search Contact" class="mt-3">
                <b-form-input v-model="searchVal"></b-form-input>
                <b-input-group-append>
                <b-button variant="success" @click="searchID(searchVal)">Submit</b-button>
                </b-input-group-append>
            </b-input-group>
          </b-col>

          <b-col cols="3">
            <b-col cols="6" class="selectLabel mt-3">
              <span>Sort by:</span>
            </b-col>
            <b-col cols="6" class="select mt-3">
              <b-form-select v-model="sortSelected" :options="sortOptions" size=""></b-form-select>
            </b-col>
          </b-col>

          <b-col cols="3">
            <b-col cols="6" class="selectLabel mt-3">
              <span>Order by:</span>
            </b-col>
            <b-col cols="6" class="select mt-3">
              <b-form-select v-model="orderSelected" :options="orderOptions" size=""></b-form-select>
            </b-col>
          </b-col>
        </b-row>
        
        <div class="mt-3">
          <b-table-simple hover small caption-top striped id="contactList" >
              <b-thead head-variant="dark">
              <b-tr>
                  <b-th>Names</b-th>
              </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr class="rowItem"  v-for="(item, key) of dataList" :key="`${ key }`">
                  <b-td v-if="filterByFavorite(item.favorite)">
                    <b-row>
                      <b-col cols="9">
                        <p class="contactName">{{ item.first_name }} {{ item.last_name }}</p>
                        <span class="contactInfo">{{ item.dial_code }}{{ item.phone_number }} - <img :src="'https://www.countryflags.io/'+ item.code +'/shiny/16.png'" alt="" class="flag">{{ item.country}}</span>
                        <span class="contactInfo subInfo">Created: {{ timeConvert(item.created_at) }}</span>
                      </b-col>
                      <b-col cols="3">
                        <b-col lg="12" class="pb-2"><b-button variant="info" size="sm" class="action mt-2" @click="changeFavorite(item.id,item.favorite)">{{ item.favorite ? 'Remove from Favorites' : 'Add to Favorites'}}</b-button></b-col>
                        <b-col lg="12" class="pb-2"><a :href="'/ContactInfo/'+item.id"><b-button variant="success" size="sm" class="action">View Contact</b-button></a></b-col>
                      </b-col>
                    </b-row>
                  </b-td>
                </b-tr>
              </b-tbody>
          </b-table-simple>
        </div>
    </b-container>
</template>

<script>
import moment from 'moment'
import _ from 'lodash';
import stateMixins from '../mixins/stateManagement'
import globalFunctions from '../mixins/globalFunctions'

import { SortBy, OrderBy } from '../classes/enums/SortOptions'

export default {
  name: 'List',
  data() {
    return {
      searchVal:'',
      dataList: [],
      temp: [],
      result: [],
      sortSelected: '',
      orderSelected: '',
      sortOptions: [],
      orderOptions: []
    }
  },

  props:{
    filter: String
  },

  watch: {
    searchVal(value) {
        this.$emit('onchange', value);
        if(value == ''){
          this.dataList = this.temp
          this.sort = 'none'
        }
    },

    sortSelected(sort){
      this.dataList = this.sorter(sort,this.orderSelected)
    },

    orderSelected(order){
      this.dataList = this.sorter(this.sortSelected,order)
    }
  },

  methods:{
    async searchID(value){
      this.temp = this.dataList

      if(value){
        this.result = this.filterCollection(value)
        this.dataList = this.result
      }else{
        this.dataList = this.temp
      }
    },

    filterCollection(key){
      return this.dataList.filter( el => {
        return el.first_name.match(key) || el.last_name.match(key) || el.phone_number.match(key) || (el.first_name + ' ' + el.last_name).match(key)
      })
    },

    sorter(sort,order){
      let sortedArray = []

      if(sort == 'created'){
        sortedArray = _.orderBy(this.dataList, function (o) {
            return moment(o.created_at).format('YYYY-MM-DD hh:mm:ss a');
        }, [order]);
        return sortedArray
      }

      sortedArray = _.orderBy(this.dataList, ['first_name'], [order]);
      return sortedArray
       
    },

    filterByFavorite(stats){
      if(this.$props.filter == 'favorites'){
        return stats ? true : false
      }
      return true
    }
  },

  async mounted(){
    this.dataList = this.dataItems
    this.temp = this.dataList
    

    // Setting Default Options
    this.sortSelected = SortBy[SortBy.findIndex(x => x.selected === true)].value
    this.orderSelected = OrderBy[OrderBy.findIndex(x => x.selected === true)].value

    // Setting Options
    this.sortOptions = SortBy
    this.orderOptions = OrderBy

    this.items= this.dataList
    this.paginatedItems = this.dataList
    this.totalRows = this.dataList.length

  },
  mixins: [stateMixins, globalFunctions]
}
</script>

<style scoped>
  .selectLabel{
    display: inline;
    padding: 0;
  }
  .select{
    display: inline-block;
    padding: 0;
  }
  .rowItem{
    text-align: left;
  }
  .contactName{
    margin: 0;
    padding-left: 15px;
    font-size: 1.5rem;
  }
  .contactInfo{
    display: block;
    margin:0;
    padding-left: 15px;
    font-size: 1rem;
  }
  .action{
    width: 100%;
  }
  .actionBtn{
    text-align: center;
  }
  .subInfo{
    font-size: 12px;
  }
  .flag{
    position: relative;
    margin-right: 5px;
    bottom: 2px;
  }
</style>
