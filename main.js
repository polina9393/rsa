const readline = require("readline")
const RSA = require("./rsa")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Send message `, (m) => {
  main(m)
  conversation()
})

const conversation = function(reply=true){
  const question = reply ? "Would you like to reply? Write `exit` to finish or your message ":"Send message again " 
  rl.question(question, (m2) => {
    if(m2!=="exit"){
      main(m2)
      conversation(!reply)
    } else{
      rl.close()
    }    
  })  
}


const main = function (m) {
  // initialise keys
  const keys = new RSA()
  keys.calculate_keys()

  // Alice sends message
  console.log("")

  const send_message = []
  const encode_character_arr = []
  for (let i = 0; i < m.length; i++) {

    const encode_character = keys.encode(m[i])
    encode_character_arr.push(encode_character)
    const alice_ciphertext = keys.encrypt(keys.e, keys.n, encode_character)

    send_message.push(alice_ciphertext)
  }
  console.log(`Alice computes array of ciphertext for each character of message ${m} \n 1. She creates encoded array of characters ${encode_character_arr} \n 2. Encrypts each character with public keys e: ${keys.e} and n:${keys.n} \n Alice ciphertext array ->`)
  console.log(`${send_message}`)

  // Bob reads
  console.log("")
  console.log("Bob decrypts Alice message")
  let encoded_message = ''
  const bob_decrypt_arr = []

  send_message.forEach(el => {
    const bob_decrypt_char = keys.decrypt(el, keys.d, keys.n)
    bob_decrypt_arr.push(bob_decrypt_char)
    encoded_message += keys.decode(bob_decrypt_char)
  })
  console.log(` 1. He decrypts each number from array ${send_message} into`)
  console.log(`${bob_decrypt_arr}`)
  console.log(` 2. then decodes into -> ${encoded_message}`)


  // Charlie
  console.log("")
  console.log("Charlie reads conversation")
  let charlie_first_message = ''
  send_message.forEach((el)=>{
    const broked_char = keys.break_rsa(keys.e, keys.n, el)
    charlie_first_message+=broked_char
  })
  console.log(` 1. He gets public keys e: ${keys.e}, n:${keys.n} and Alice's ciphertext array ${send_message}`)
  console.log(` 2. Computer store of all possible prime numbers multiplications as hash table`)
  console.log(` 3. Finds matched p*q ${keys.primes_mult_hash_table[keys.n]} and then calculates r, d`)

  console.log(` 4. Computes the message ${charlie_first_message}`)


}