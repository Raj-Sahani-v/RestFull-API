import express from "express"
import methodOverride from "method-override"
import { faker } from '@faker-js/faker';
import mysql from 'mysql2';
import {v4 as uuidv4} from "uuid"



const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs")

let createRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
    faker.person.fullName(),
    faker.number.int({min:10,max:5000}),
    
   
    faker.number.int({min:10,max:10000}),
    

  ];
}
// =========== Bulk data create ======
// let bulkData=[];

// for(let i =0;i<=1000;i++){
//     const data = createRandomUser();
//     console.log(data);
//     bulkData.push(data);
// }
// console.log(bulkData)


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node_app',
  password:'273152',
});
// // //  console.log(createRandomUser.user)
// let q="INSERT INTO users_node(id,username,email,password,fullName,following,follower) VALUES ? ";
// // // // single data at a time// let user_Value = [`${createRandomUser().userId}`,`${createRandomUser().username}`,`${createRandomUser().email}`,`${createRandomUser().password}`]
// // // //               ------bulk Data store karna---------


// try{
//   connection.query(q,[bulkData],(err,result)=>{
//   if(err){
//     throw err;
//   }
//  console.log(result);
// //  console.log(result.length);
// })
// }
// catch (e){
//   console.log(e)
// }
// connection.end();

// console.log(createRandomUser());

//===================================count is global=================== 

//==========================Routing ==============================
app.get("/",(req,res)=>{
  let q= `SELECT COUNT(*) FROM users_node`;
  try {
    
    connection.query(q,(err,result)=>{
     
    if(err) throw err;
    //console.log("result = ",result[0]['COUNT(*)']);
    let count = result[0]["COUNT(*)"];
    console.log("count",count);
    res.render("home",{count});
  });
  
  } catch (error) {
    console.log(error);
  }
  
  
})



app.get("/profile",(req,res)=>{
  let q = "SELECT id ,username,email,follower,following,fullName FROM users_node";
  connection.query(q,(err,result)=>{
    if(err)throw err;
    console.log(result);
    let sno=0;

    res.render("all_Profile",{result,sno})
  })

  
});


app.get("/profile/:id",(req,res)=>{
    const{id}=req.params;
     let q = "SELECT id,username,email FROM users_node";
     connection.query(q,(err,result)=>{
    if(err)throw err;
    let user_check=result.find(user=>user.id===id);

    console.log(user_check);
      if(user_check){
         res.render("one_Profile",{user_check})
      }else{
        res.send("iss user ka data nahi hai");
      }
    
  })

})



// app.get("/profile/:userName/posts", (req, res) => {
//   const{userName}=req.params;
  
//     res.render("post",{userName});
  
// });
//=============++++++++++++++-----upload --==== 
// app.post("/profile/:userName/posts",async(req,res)=>{
//   const {userName}= req.params;
//   //console.log(req.body);
//   const {Tags,Type,posts}=await req.body;
//   const data = await {
//     Tags,Type,posts
//   }
  
//   console.log(data);
//   profile.forEach((id)=>{
//     if(id.username===userName){
//       const newPosts=id.posts.push(data);
//       console.log(id.posts)
//       console.log(newPosts)
//     }
//   });


//     res.redirect(`/profile/${userName}`)
// });

app.get("/profile/:id/edit",(req,res)=>{
  const {id}=req.params;
  let q="SELECT username,fullname FROM users_node WHERE id = ?";
  try {
    connection.query(q,[id],(err,result)=>{
      if(err) throw err;
      console.log(result);
      console.log(result[0].fullname)
       res.render("edit",{result,id});
    })
  } catch (error) {
      console.log(error)
  }
 
})

app.patch("/profile/:id",(req,res)=>{
  let {id}=req.params;
  const new_fullname=req.body.fullname;
  const new_username=req.body.username;
  console.log(new_fullname)
  console.log("form data",req.body);
  //database

  let q= `UPDATE users_node SET username = ? , fullname= ? WHERE id = ?`;
  let upadte=[new_username,new_fullname,id]
  try {
    connection.query(q,[new_username,new_fullname,id],(err,result)=>{
      if(err)throw err;
      console.log(result)
    })
    
  } catch (error) {
      console.log("Username update :",error)
  }

  // //const users = result.find(name =>name.username===user);
  // if(users){
   
  //   users.username=new_username;
  //   user=new_username;
  // }

  // console.log(users)

  
  res.redirect(`/profile/${id}`)
})

app.post("/profile/:username",(req,res)=>{
  const {username}=req.params;
  res.redirect(`/profile/${username}`);
});

app.delete("/profile/:id",(req,res)=>{
  let {id}=req.params;
  let q = 'DELETE FROM users_node WHERE id=?'
try {
  connection.query(q,[id],(err,result)=>{
    if(err) throw err;
    console.log(result)
  })
  
} catch (error) {
  console.log("delete account",error);
}
  res.redirect(`/profile`);
})

app.get("/create",(req,res)=>{
res.render("new_account");
})
app.post("/profile",async (req,res)=>{
const id= uuidv4();
console.log(id);
const username =req.body.username;
const email=req.body.email;
const password =  req.body.password;
const fullName = req.body.fullName;


// let newData = [id,username,email,password];

const q = 'INSERT INTO users_node(id,username,email,password,fullname) values (?,?,?,?,?)';

try {
  connection.query(q,[id,username,email,password,fullName],(err,result)=>{
  if(err) throw err;
  console.log("add",result);
 res.redirect("/profile");

})
} catch (error) {
    console.log("add error",error)
}




})




app.listen(5000,()=>{
    console.log("server is runnig");
})