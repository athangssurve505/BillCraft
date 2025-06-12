import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

export default function Loader() {
  return (
    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%', overflow:'hidden'}}>
        <ClipLoader
          color="#4EAD4E"
          loading={true}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

    </div>
  )
}
