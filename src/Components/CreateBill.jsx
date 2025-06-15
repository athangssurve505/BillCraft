import React, { useEffect } from 'react'
import "../Css/BillPage.css"
import { useState,useRef} from 'react'; 
import { useFirebase } from '../Context/Firebase';
import { toast} from 'react-toastify';
import axios from 'axios';


export default function CreateBill() {
  
  
  const [BillData, setBillData] = useState({
    cycleName:"",
    image: null,
    bill:[[],[],[]],
    total:null,
    imageUrl:null,
    createdAt: new Date()
  });
  const [total, settotal] = useState(null)
  const [error, seterror] = useState("")
  const firebase = useFirebase();


    const cycleName = useRef();
    const saveButton = useRef();
    
    
    const [image, setImage] = useState(null); // State to store the selected image
    const [imageUrl, setImageUrl] = useState(null);
    const [count, setcount] = useState(3)
    const [rows, setRows] = useState([
        { id: 3, name: "", quantity:null, price:null},
      ]);
    const [validSave, setvalidSave] = useState(false)

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
          const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
          if (fileSizeInMB <= 5) {
          setImage(file)
          const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the image
          setImageUrl(imageUrl); // Set the image URL in state
        }
        else {
          toast.error("File Size Exceeds 5MB")
        }
      }
      };

      const getImageUrl = async () =>{
        const formData = new FormData();
      
        formData.append("image", image);
        try{
          const response = await axios.post("https://billcraft-backend-dkux.onrender.com/upload",formData)
          console.log(response.data.url)
          return response.data.url
        }catch(err){console.log(err)}
        
      }

      useEffect(() => {
        if(saveButton.current && !validSave){
          saveButton.current.disabled = true;
          saveButton.current.style.backgroundColor = 'grey'; 
        } 
        else{
          saveButton.current.disabled = false;
          saveButton.current.style.backgroundColor = '#4CAF50'; 
        }
      
      }, [saveButton,validSave])
      


      const checkData = () => {
        const cycleNameValue = cycleName.current.value.trim();
        if (!cycleNameValue) {
          seterror("Cycle name is required. Please provide a valid cycle name.");
          console.log("Cycle name is missing.");
          return;
        }
        setBillData((prevData) => ({
          ...prevData,
          cycleName: cycleNameValue,
        }));
      
        let total = 0;
        console.log(imageUrl)
        if(!imageUrl){seterror("Please provide Cycle Image");  return;}
       
        for (let row of BillData.bill) {
          // Check if the row is empty
          if (row.length === 0) {
            seterror("Some rows are incomplete. Please fill in all fields.");
            console.log("Some rows are incomplete. Please fill in all fields.");
            return;
          }
      
          for (let i = 0; i < 3; i++) {
            const cellValue = row[i]; // Extract the value at index i for readability
      
            // Check for null or undefined values
            if (cellValue == null || cellValue === undefined) {
              seterror(`Some fields are empty. Please fill in all fields.`);
              console.log(`Field at index ${i} is empty.`);
              return;
            }
      
            // Check for empty string or invalid data
            if (i === 0) {
              // Validate item name
              if (cellValue.trim().length === 0) {
                seterror("Item name is missing. Please provide a valid item name.");
                console.log("Item name is missing. Please provide a valid item name.");
                return;
              }
            } else {
              // Validate Quantity and Price
              if (cellValue.trim().length === 0) {
                seterror(`Quantity or Price field is empty. Please fill in those fields.`);
                console.log(`Field at index ${i} is empty.`);
                return;
              }
      
              const numericValue = parseInt(cellValue, 10);
              if (isNaN(numericValue) || numericValue <= 0) {
                seterror("Quantity and price must be valid numbers greater than 0. Please check the row and update.");
                console.log("Error: Quantity and price must be valid numbers greater than 0. Please check the row and update.");
                return;
              }
      
              if (i === 2) {
              
                total += numericValue; // Add price to total
              }
            }
          }
        }
      
        // Update total in state and clear errors
        setBillData((prevData) => ({
          ...prevData,
          total: total,
        }));
        seterror(null);
        settotal(total); 
        setvalidSave(true)
      console.log(validSave)
      };
        // Log the updated state after validation

        const handleAddBill = async () => {
          const cycleNameValue = cycleName.current.value.trim();
          try {
            const user = await firebase.getCurrentUser();
            const email = user.email;
            const username = email.split("@")[0];
        
            console.log("🔥 Starting addBillData");
        
            const imageUrl = await getImageUrl(); // Confirm this line is not hanging
        
            console.log("🖼️ Image uploaded:", imageUrl);
        
            await firebase.addBillData({
              cycleName: cycleNameValue,
              bill: convertBillArrayToObjects(BillData.bill),
              total: total,
              imageUrl: imageUrl,
              Date: BillData.createdAt,
            }, username);
        
            console.log("✅ Bill added successfully!");
        
            toast.success("Bill created successfully!");
        
          } catch (error) {
            console.error("❌ Error adding bill:", error);
            toast.error("Failed to create bill");
          }
        
          console.log("Updated Data:", {
            cycleName: cycleNameValue,
            bill: BillData.bill,
            total: total,
            Date: BillData.createdAt,
          });
        };
        
      
       
     
      
            

      const convertBillArrayToObjects = (billArray) => {
        return billArray.map(([item, quantity,price]) => ({
          item,
          quantity,
          price,
        }));
      };

    

      const setTableData = (value, rowIndex, colIndex) => {
        setvalidSave(false)
        const valueData = value

        setBillData((prevData) => {
          const updatedBill = [...prevData.bill];
        
          updatedBill[rowIndex][colIndex] = valueData;
        
          return {
            ...prevData, 
            bill: updatedBill, 
          };
        });
        
      
      
      };
    

      const addRow = () =>{
        setvalidSave(false)
        setBillData((prevData) => ({
          ...prevData, // Spread the rest of the state object
          bill: [...prevData.bill, []], // Add a new row (empty array) to the `bill` array
        }));
        
        // console.log(BillData)
        const newRow = {
            id: count + 1,
            name: null,
            quantity: null,
            price: null,
          };
       setcount(count+1)
          setRows([...rows, newRow]);   
      }



  


  return (
    <div className='bill-page-wrapper'>
        <div className="bill-input-wrapper">
        <label>Cycle Name:</label>
        <input ref={cycleName}type='text' onChange={()=>{setvalidSave(false)}}className='cycle-name'  required/>
        </div>
        
        <div className="border">
        <label>Cycle Image:</label>
        <div className={imageUrl ? "image" : "image no-img"} >{imageUrl && <img src={imageUrl} alt="Preview" />}
        {!imageUrl && <h2>Image Preview</h2>}
        </div>
            <div className="file-wrapper"><input type="file" accept="image/*"  className='cycleImage' onChange={handleImageChange}/></div>
    
        </div>

            <div className="item-table">
        <table>
            <tbody>
            <tr className='info-row'>
                <td>Item no</td>
                <td>Item Name</td>
                <td>Quantity</td>
                <td>Price</td>
            </tr>
            <tr>
                <td>1</td>
                <td><input type='text'className='table-input' onChange={(e) => setTableData(e.target.value, 0, 0)} required/></td>
                <td><input type='number'className='table-input' onChange={(e) => setTableData(e.target.value, 0, 1)}  required/></td>
                <td><input type="number"className='table-input'   onChange={(e) => setTableData(e.target.value, 0, 2)}  required/></td>
            </tr>
            <tr>
                <td>2</td>
                <td><input type='text'className='table-input' onChange={(e) => setTableData(e.target.value, 1, 0)} required/></td>
                <td><input type='number'className='table-input' onChange={(e) => setTableData(e.target.value, 1, 1)}required/></td>
                <td><input type='number'className='table-input'   onChange={(e) => setTableData(e.target.value, 1, 2)}
                  
                 required/></td>
            </tr>

            {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td><input type="text" defaultValue={row.name} className='table-input' onChange={(e) => setTableData(e.target.value, row.id-1, 0)}required/></td>
              <td>
                <input type="number" defaultValue={row.quantity} className='table-input' onChange={(e) => setTableData(e.target.value,row.id-1, 1)}required/>
              </td>
              <td>
                <input type="number" defaultValue={row.price} className='table-input'  onChange={(e) => setTableData(e.target.value, row.id-1, 2)}required/>
              </td>
            </tr>
          ))}

            </tbody>
        </table>
       
        </div>
        {error &&<p className='error-message'>{error}</p>}
        {total &&<p className='total'>{`Total: ₹${total}`}</p>}
        <div className="buttons">
        <button onClick={addRow}>Add Row</button>
        <button onClick={checkData}>Calculate</button>
        <button  ref={saveButton} onClick={handleAddBill}>Save</button>
        </div>
    </div>
  )
}
