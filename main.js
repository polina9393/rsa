const readline = require("readline")
const RSA = require("./rsa")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Send message `, (m) => {
  main(m, true)
  conversation(true,true)
})

const conversation = function(reply, alice){
  const question = reply ? "Would you like to reply? Write `exit` to finish or your message ":"Send message again " 
  rl.question(question, (m2) => {
    if(m2!=="exit"){
      main(m2,!alice)
      // repeat again as another person
      conversation(!reply, !alice)
    } else {
      rl.close()
    }    
  })  
}


const main = function (m, alice) {
  // Initialise keys
  const keys = new RSA()
  keys.calculate_keys()

  // Define which person
  const sender = alice ? "Alice" : "Bob"
  const reciever = alice ? "Bob" : "Alice"

  // Sender
  console.log("")

  const send_message = []
  const encode_character_arr = []
  for (let i = 0; i < m.length; i++) {

    const encode_character = keys.encode(m[i])
    encode_character_arr.push(encode_character)
    const ciphertext = keys.encrypt(keys.e, keys.n, encode_character)

    send_message.push(ciphertext)
  }
  console.log(`${sender} computes array of ciphertext for each character of message ${m} \n 1. Creates encoded array of characters ${encode_character_arr} \n 2. Encrypts each character with public keys e: ${keys.e} and n: ${keys.n} \n ${sender} ciphertext array ->`)
  console.log(`${send_message}`)

  // Reader
  console.log("")
  console.log(`${reciever} decrypts ${sender} message`)
  let encoded_message = ''
  
  const decrypt_arr = []
  send_message.forEach(el => {
    const bob_decrypt_char = keys.decrypt(el, keys.d, keys.n)
    decrypt_arr.push(bob_decrypt_char)
    encoded_message += keys.decode(bob_decrypt_char)
  })
  console.log(` 1. Decrypts each number from array ${send_message} into`)
  console.log(`${decrypt_arr}`)
  console.log(` 2. Then decodes into -> ${encoded_message}`)


  // Charlie
  console.log("")
  console.log("Charlie reads conversation")
  let charlie_message = ''
  send_message.forEach((el)=>{
    const broked_char = keys.break_rsa(keys.e, keys.n, el)
    charlie_message+=broked_char
  })
  console.log(` 1. He gets public keys e: ${keys.e}, n: ${keys.n} and ${sender} ciphertext array ${send_message}`)
  console.log(` 2. Computes store of all possible prime numbers multiplications as hash table`)
  console.log(` 3. Finds matched p*q ${keys.primes_mult_hash_table[keys.n]} and then calculates r, d`)

  console.log(` 4. Gets the message ${charlie_message}`)
}