import moment from 'moment'
import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { deleteWishesData } from '../../../../../features/wishes/wishSlice'

function WishColumn(props) {
  moment.locale('de')
  const dispatch = useDispatch()

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
            onClick={() => dispatch(deleteWishesData(props.wish.id))}
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
