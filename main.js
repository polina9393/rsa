const readline = require("readline")
const RSA = require("./rsa")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Send message > `, (m) => {
  main(m, true)
  conversation(true,true)
})

const conversation = function(reply, alice){
  const question = reply ? "Would you like to reply? Write `exit` to finish or your message > ":"Send message again > " 
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

const send = (sender_str, keys, message)=>{
  // Sender
  console.log("")

  const send_message = []
  const encode_character_arr = []
  for (let i = 0; i < message.length; i++) {

    const encode_character = keys.encode(message[i])
    encode_character_arr.push(encode_character)
    const ciphertext = keys.encrypt(keys.e, keys.n, encode_character)

    send_message.push(ciphertext)
  }
  console.log(`${sender_str} computes array of ciphertext for each character of message ${message} \n 1. Creates encoded array of characters ${encode_character_arr} \n 2. Encrypts each character with public keys e: ${keys.e} and n: ${keys.n} \n ${sender_str} ciphertext array ->`)
  console.log(`${send_message}`)

  return send_message
}

const read = (reciever_str, sender_str, keys,send_arr)=>{
  // Reader
  console.log("")
  console.log(`${reciever_str} decrypts ${sender_str} message`)
  let encoded_message = ''
  
  const decrypt_arr = []
  send_arr.forEach(el => {
    const decrypt_char = keys.decrypt(el, keys.d, keys.n)
    decrypt_arr.push(decrypt_char)
    encoded_message += keys.decode(decrypt_char)
  })
  console.log(` 1. Decrypts each number from array ${send_arr} into`)
  console.log(`${decrypt_arr}`)
  console.log(` 2. Then decodes into -> ${encoded_message}`)
}

const main = function (m, alice) {
  // Initialise keys
  const keys = new RSA()
  keys.calculate_keys()

  // Define which person
  const sender = alice ? "Alice" : "Bob"
  const reciever = alice ? "Bob" : "Alice"

  // Sender action
  const send_arr = send(sender,keys,m)

  // Reciever action
  read(reciever, sender, keys, send_arr)


  // Charlie
  console.log("")
  console.log("Charlie reads conversation")
  let charlie_message = ''
  send_arr.forEach((el)=>{
    const broked_char = keys.break_rsa(keys.e, keys.n, el)
    charlie_message+=broked_char
  })
  console.log(` 1. He gets public keys e: ${keys.e}, n: ${keys.n} and ${sender} ciphertext array ${send_arr}`)
  console.log(` 2. Computes store of all possible prime numbers multiplications as hash table`)
  console.log(` 3. Finds matched p*q ${keys.primes_mult_hash_table[keys.n]} and then calculates r, d`)

  console.log(` 4. Gets the message ${charlie_message}`)
}