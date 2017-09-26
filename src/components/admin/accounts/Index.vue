<template lang="pug">
.layout-padding
  create-account(v-if="!editingAccount" @accountCreated="addAccount")

  edit-account(v-if="editingAccount", :account="editingAccount" @accountUpdated="updateAccount" @cancelUpdate="cancelUpdate")

  q-data-table(:data="accounts", :config="config", :columns="columns" @refresh="refresh" @selection="selection" @rowclick="rowClick")

    template(slot="col-roles" scope="cell")
      q-icon.text-positive(v-if="cell.data.includes('admin')" style="font-size: 25px" name="supervisor_account")

    template(slot="col-active" scope="cell")
      q-icon.text-negative(v-if="!cell.data" style="font-size: 25px" name="not_interested")
      q-icon.text-positive(v-else style="font-size: 25px" name="done")

    template(slot="col-action" scope="cell")
        q-btn(@click="deleteAccount(cell.row)" small color="negative") Del
        q-btn.on-right(@click="editAccount(cell.row)" small color="primary") Edit

</template>

<script>
import CreateAccount from './Create'
import EditAccount from './Edit'

import { Dialog, Toast, QBtn, QDataTable, QIcon } from 'quasar'

export default {
  components: {
    CreateAccount,
    EditAccount,
    QBtn,
    QDataTable,
    QIcon
  },
  data () {
    return {
      editingAccount: null,
      accounts: [],
      config: {
        rowHeight: '50px',
        title: 'Accounts', // opt
        noHeader: false, // opt
        refresh: true, // opt
        columnPicker: true, // opt
        leftStickyColumns: 2, // opt
        rightStickyColumns: 1, // opt
        // (optional)
        // Styling the body of the data table;
        // 'minHeight', 'maxHeight' or 'height' are important
        // bodyStyle: {
        //   maxHeight: '500px'
        // },
        responsive: true, // opt
        pagination: { // opt
          rowsPerPage: 10,
          options: [5, 10, 25, 50]
        },
        // (optional) Select one or more rows for an action
        // 'single' adds a column with radio buttons for single row selection
        // 'multiple' adds a column with checkboxes for multiple row selection
        // omitting the property will result in no selection column at all
        // selection: 'multiple',
        // (optional) Override default messages when no data is available
        // or the account filtering returned no results.
        messages: {
          noData: 'No data available to show.',
          noDataAfterFiltering: 'No results. Please refine your search terms.'
        }
        // (optional) Override default labels. Useful for I18n.
        // labels: {
        //   columns: 'Coluuuuumns',
        //   allCols: 'Eeeeeeeeevery Cols',
        //   rows: 'Rooows',
        //   selected: {
        //     singular: 'item selected.',
        //     plural: 'items selected.'
        //   },
        //   clear: 'clear',
        //   search: 'Search',
        //   all: 'All'
        // }
      },
      columns: [
        {
          label: 'ID',
          field: 'id',
          width: '30px',
          // (optional) Column CSS style
          // style: {color: '#ff09fa'},
          // 'style' can be a function too if you want to apply
          // certain CSS style based on cell value:
          // style (cell_value) { return .... }
          // (optional) Column CSS classes
          // classes: 'bg-primary',
          // 'classes' can be a function too if you want to apply
          // certain CSS class based on cell value:
          // classes (cell_value) { return .... }
          // (optional) Can filter/search be applied to this column?
          filter: true,
          // (optional) Sortable column?
          // If yes, then also specify `type` prop to know how to sort
          sort: true,
          // or you can specify a custom sorting method;
          // works same as Array.prototype.sort().
          // Return codes:
          //   < 0 --> 'a' should be before 'b'
          //   0   --> 'a' is same as 'b'
          //   > 0 --> 'a' should be after 'b'
          // sort (a, b) {
          //   return (new Date(a)) - (new Date(b))
          // },
          // Type required if using sort.
          // Available values: 'string', 'number', 'date', 'boolean'
          type: 'number'
          // (optional)
          // use a formatter for this column;
          // transforms original String in another String
          // format (value, row) {
          //   return new Date(value).toLocaleString()
          // }
        },
        {
          label: 'Name',
          field: 'name',
          width: '120px',
          filter: true,
          sort: true,
          type: 'string'
        },
        {
          label: 'Email',
          field: 'email',
          width: '120px',
          filter: true,
          sort: true,
          type: 'string'
        },
        {
          label: 'Admin',
          field: 'roles',
          width: '25px',
          // filter: true,
          sort (a, b) {
            let aa = a.includes('admin')
            let bb = b.includes('admin')
            return aa === bb ? 0 : bb - aa
          },
          type: 'boolean'
        },
        {
          label: 'Active',
          field: 'active',
          width: '25px',
          // filter: true,
          sort: true,
          type: 'boolean'
        },
        {
          label: 'Actions',
          field: 'action',
          width: '100px'
        }
      ]
    }
  },
  methods: {
    refresh (done) {
      this.fetchAccounts().then(() => {
        done()
      }, () => {
        done()
      })
    },
    selection (number, rows) {
      // console.log(`selected ${number}: ${rows}`)
    },
    rowClick (row) {
      // console.log('clicked on a row', row)
      // this.$refs.create.open()
    },
    someRowAction (id) {
      // console.log('Action clicked for row with id: ' + id)
    },
    fetchAccounts () {
      return new Promise((resolve, reject) => {
        this.axios.get('/admin/accounts').then(res => {
          this.accounts = res.data.accounts
          resolve()
        }, err => {
          console.log(err.response.data)
          reject(err)
        })
      })
    },
    addAccount (account) {
      this.accounts.push(account)
    },
    removeAccount (account) {
      // return row index is not data.account' index!
      this.accounts = this.accounts.filter(row => { return row.id !== account.id })
    },
    editAccount (account) {
      this.editingAccount = account
    },
    cancelUpdate () {
      this.editingAccount = null
    },
    updateAccount (account) {
      console.log('update account', account)
      if (account === null) this.editAccount = null
      else {
        this.accounts = this.accounts.filter(row => { return row.id !== account.id })
        this.accounts.push(account)
        this.editingAccount = null
      }
    },
    deleteAccount (account) {
      Dialog.create({
        title: 'Confirm Delete Account',
        message: 'Are you sure you want to delete account ' + account.name,
        buttons: [
          'Cancel',
          {
            label: 'Delete Account',
            handler: () => {
              this.axios.delete('/admin/accounts/' + account.id).then(res => {
                Toast.create.positive({html: 'Account Deleted'})
                this.removeAccount(account)
              }, err => {
                Toast.create.negative({html: err.response.data.error})
              })
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.fetchAccounts()
  }
}
</script>

<style lang='stylus'>

</style>
