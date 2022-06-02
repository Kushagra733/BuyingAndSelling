import React, {useEffect,useState} from 'react';
import './App.css';
import Web3 from 'web3';
import MarketPlaceABI from '../abis/Marketplace.json'

const App = ()=>{

  var arr= [];

  const [web3,setweb3] = useState(null);
  const [address,setaddress] = useState(null);
  const [contract,setcontract] = useState(null);
  const [name,setname] = useState("");
  const [price,setprice] = useState(0);
  const [number,setnumber] = useState(0);
  const [products,setproduc] = useState([]);



  useEffect(()=>{

    
    const getmeta = async()=>{
      if (window.ethereum) {
      try {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setweb3(new Web3(window.ethereum));
        setaddress(res);
        
      } catch (err) {
        console.error(err);
       
      }
    } 
    else{
      console.log("err");
    }
  }
  getmeta();
  


  })

  useEffect(()=>{
    var instance = null;
    web3 && (instance = new web3.eth.Contract(MarketPlaceABI.abi,'0xAb3aC15c879657caeE18304855619D85bfE69DC3'));
    setcontract(instance);

  },[web3])

  

  const sell = async()=>{
    await contract.methods.createProduct(name,price).send({from:address.toString()}).catch((e)=>{console.log(e)}).catch((e)=>{console.log(e)});
  }

  useEffect(()=>{
      
    const getpro = async()=>{
      var prodcount = await contract.methods.productCount.call().catch((e)=>console.log(e)).catch((e)=>{console.log(e)});
      setnumber(prodcount);
    }

      contract && getpro();
      
      
  },[contract])


  useEffect(()=>{

   const getprod = async()=> {
     arr= [];
    for(var i=1;i<=parseInt(number.toString());i++)
    {
          const newprod = await contract.methods.products(i).call().catch((e)=>console.log(e)).catch((e)=>{console.log(e)});
          arr.push(newprod);
    }
    setproduc(arr);
  }

  contract && getprod();
  },[contract])


  const buy = async(x)=>{
      await contract.methods.purhcaseProduct(x).call({from:address.toString()}).catch((e)=>{console.log(e)}).catch((e)=>{console.log(e)});
  }

  return(
    <>
          <form>
    <div class="form-group">
    <label for="exampleInputEmail1">Name</label>
    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Name" value={name} onChange={(e)=>{setname(e.target.value)}}/>
    </div>
    <div class="form-group">
    <label for="exampleInputPassword1">Price</label>
    <input type="number" class="form-control" id="exampleInputPassword1" placeholder="Price" value={price} onChange={(e)=>{setprice(e.target.value)}}/>
    </div>
    
  
  </form>
  <button type="submit" class="btn btn-primary" onClick={sell}>Submit</button>

  <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
      <th>Owner Address</th>
      <th scope="col">Buy</th>
    </tr>
  </thead>
  <tbody>
    
     {
        
        products && products.map((item,key)=>{

            return(
              <tr>
              <th scope="row">{key}</th>
              <td>{item.name}</td>
              <td>{item.price.toString()}</td>
              <td>{item.owner}</td>
              <td><button className='btn btn-primary' onclick={buy(key)}>Buy</button></td>     
                
            
              
              
            </tr>
            )

        })
      
     }
   


    
  </tbody>
</table>
    </>
  )
}

export default App;

