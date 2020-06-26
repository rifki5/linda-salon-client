import React, { Component } from 'react'
import { Calendar, Badge } from 'antd'
import { Query } from 'react-apollo'
import { BookingsFilterByDateQuery, BookingsFilterByDateQueryVariables } from 'types/schema-types';
import BOOKING_Q from 'queries/booking/bookingsFilterByDate.graphql'
import moment, { Moment } from 'moment'

type State = typeof initialState

const initialState = {
  value: moment(),
  selectedValue: moment(),
}

class DataCalendar extends Query<BookingsFilterByDateQuery, BookingsFilterByDateQueryVariables> {}
class FullCalendar extends Component<Object, State> {
  readonly state = initialState

  getListData = (value: Moment, data: BookingsFilterByDateQuery) => {
    const { selectedValue } = this.state
    if (
      value.month().toString() === selectedValue.month().toString()
      && data.bookingsFilterByDate 
      && data.bookingsFilterByDate.length
      ) {
      const index = data.bookingsFilterByDate.findIndex(datax => datax.date === value.date())
      if (index >= 0) {
        return data.bookingsFilterByDate[index].data
      } else {
        return []
      }
      
    } else {
      return []
    }
  }

  dateCellRender = (value: Moment, data: BookingsFilterByDateQuery) => {
    const listData = this.getListData(value, data);
    return (
      <ul className="events" style={{ paddingLeft: 0 }}>
        {
          listData.map(item => (
            <li key={item.content} style={{ listStyle: "none" }}>
              <Badge status={item.type as any} text={item.content} />
            </li>
          ))
        }
      </ul>
    )
  }

  handleChange = (value: Moment | undefined) => {
    if (value) {
      this.setState({
        value,
        selectedValue: value
      } as any)
    }
  }

  onPanelChange = (value: Moment) => {
    this.setState({
      value
    })
  }

  render() {
    const { value, selectedValue } = this.state
    return (
      <DataCalendar
        query={BOOKING_Q}
        variables={{
          dateNow: selectedValue.valueOf()
        } as any}
      >
        {({ data, error, loading }) => {
          if (!loading && !error && data && data.bookingsFilterByDate) {
            return (
              <Calendar value={value} onSelect={this.handleChange}  onPanelChange={this.onPanelChange} dateCellRender={(value) => this.dateCellRender(value, data)} />
            )
          } else {
            return null
          }
        }}
      </DataCalendar>
    )
  }
}

export default FullCalendar