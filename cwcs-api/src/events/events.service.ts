import { Injectable } from '@nestjs/common'
import { RoleStatus } from '../accounts/enums/role-status.enum'

@Injectable()
export class EventsService {
  constructor() { }

  ACCOUNTS = []

  async getActiveAccountsByRole(role: RoleStatus) {
    return this.ACCOUNTS.filter(account => { return account.role == role })
  }

  getActiveAccountsBySockettId(socketId): any {
    return this.ACCOUNTS.filter(account => { return account.socketId === socketId })
  }

  async getActiveRooms() {
    let data = []
    this.ACCOUNTS.filter(account1 => {
      let quantity = 0 
      this.ACCOUNTS.filter(account2 => {
        if(account1.roomName === account2.roomName) {
          quantity++
        }
      })
      data.push({roomName: account1.roomName,  quantity: quantity})
    })

    data = this.removeDuplicates(data, 'roomName')

    //console.log(data)

    return data
  }

  async getActiveWorkstationsFromRoom(roomName) {
    let data = []

    this.ACCOUNTS.filter(account => {
      if(account.roomName === roomName) {
        data.push({ accountId: account.accountId, firstName: account.firstName, lastName: account.lastName, addressMac: account.addressMac })
      }
    })

    //console.log(data)

    return data
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
  }

  async addActiveAccount(account): Promise<Boolean> {
    const { socketId, accountId, role, roomName, workstationName, addressMac, firstName, lastName } = account

    if(this.ACCOUNTS.findIndex((e) => e.accountId === accountId || e.addressMac === addressMac) < 0) {
      account = {
        socketId: socketId,
        accountId: accountId,
        role: role,
        firstName: firstName,
        lastName: lastName,
        roomName: roomName,
        workstationName: workstationName,
        addressMac: addressMac.replace('-', ':').toUpperCase()
      }

      this.ACCOUNTS.push(account)
      
      //console.log(this.ACCOUNTS)
      return true
    } else {
      return false
    }
  }

  async removeActiveAccount(socketId) {
    this.ACCOUNTS = this.ACCOUNTS.filter(account => { return account.socketId !== socketId })
    //console.log(this.ACCOUNTS)
  }

}
