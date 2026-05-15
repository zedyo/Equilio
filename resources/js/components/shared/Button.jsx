import React from 'react'

function Button(props) {
  return <button type="submit">{props.name}</button>
  //    props.children ersetzt das was im Kindelement ist zwischen {}
}

export default Button
