import React, { useEffect, useState } from 'react';
import './../Css/Bills.css'
import { useFirebase } from '../Context/Firebase';
import noBills from '../assets/no-bill.png'
import Loader from './Loader';


const Bills = () => {

  const [dataFound, setDataFound] = useState(null)
  const [bills, setBills] = useState([{
    cycleName: "",
    image: "",
    amount: "",
    date: "",
    bill:[{}],
  }]);
  const firebase = useFirebase();

  const getUser = async () =>{
    let user = await firebase.getCurrentUser();
    return user.email.split("@")[0];
  }

  useEffect(() => {
    // Fetch from Firebase

    const fetchBills = async () => {
      const data = await firebase.getAllBills(await getUser());
      if (data?.[0]?.cycleName == null){
        setDataFound(false)}
        else{
      const formattedData = data.map((item)=>{
        return {
          cycleName: item.cycleName,
          image: item.imageUrl,
          amount: item.total,
          date: item.Date.toDate().toLocaleDateString(),
          bill: item.bill,
        }
      })
      setBills(formattedData);
      setDataFound(true)
    };
  
  }

    fetchBills();
  }, []);

  return (  
    <>
 {dataFound == null ? (
  <Loader />
) : dataFound ? (
  <div className="bills-container">
    <h1 className="title">My Bills</h1>
    <div className="bills-grid">
      {bills.map((bill, index) => (
        <div key={index} className="bill-card">
          <h3>{bill.cycleName}</h3>
          <p><strong>Amount:</strong> ₹{bill.amount}</p>
          <p><strong>Date:</strong> {bill.date}</p>
          {bill.image && (
            <img src={bill.image} alt="bill" className="bill-image" />
          )}
          <table className="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bill.bill.map((item, i) => (
                <tr key={i}>
                  <td>{item.item}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="no-bills">
    {/* <Loader /> */}
    <div className="no-bills-content">
      <img
        src={noBills}
        loading='eager'
        alt="No bills illustration"
        className="no-bills-image"
      />
      <p>No bills found. It looks like you haven't added any cycle bills yet.</p>
    </div>
  </div>
)}

  </>
  )
}

export default Bills;