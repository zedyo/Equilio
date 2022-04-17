import moment from 'moment'
import React from 'react'
import { Button } from 'react-bootstrap'

function WishColumn(props) {
  moment.locale('de')

  return (
    <>
      <tr>
        <td>
          {moment(
            `${props.wish.year}-` +
              `${props.wish.month}-` +
              `${props.wish.day}`,
            'YYYY-M-D'
          ).format('LL')}
        </td>
        <td>{props.wish.shift.abrv}</td>

        <td>
          <Button
            onClick={() => props.deleteWish(props.wish.id)}
            variant="outline-danger"
            size="sm"
          >
            Löschen
          </Button>{' '}
        </td>
      </tr>
    </>
  )
}

export default WishColumn
