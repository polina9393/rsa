const readline = require("readline")
const RSA = require("./rsa")


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Send message to Bob (no longer than two characters) `, (m) => {
  rl.question('Reply to Alice (no longer than two characters) ', (m2) => {
    main(m,m2)
    rl.close()
  })
})

const main = function (m,m2) {
  const keys = new RSA()
  keys.calculate_keys()

  const message = keys.encode(m)
  console.log("")
  const alice_ciphertext = keys.encrypt(keys.e, keys.n, message)
  console.log(`Alice computes ciphertext with message ${m}, encoded number ${message}, public keys e: ${keys.e} and n:${keys.n} \n ------>`)
  console.log(`${alice_ciphertext}`)
  const bob_decrypt = keys.decrypt(alice_ciphertext, keys.d, keys.n)
  console.log('        Bob decrypts message into '+bob_decrypt+' and then decode into '+keys.decode(bob_decrypt))

  const second_message = keys.encode(m2)
  console.log("")
  const bob_ciphertext = keys.encrypt(keys.e, keys.n, second_message)
  console.log(`Bob replies with ciphertext where message ${m2} encode ${second_message}, public keys e: ${keys.e} and n:${keys.n} \n ------>`)
  console.log(`${bob_ciphertext}`)
  const alice_decrypt = keys.decrypt(bob_ciphertext, keys.d, keys.n)
  console.log('        Alice decrypts message into '+alice_decrypt+' and then encrypts into '+keys.decode(alice_decrypt))

  // Charlie
  const charlie_first_message = keys.break_rsa(keys.e, keys.n, alice_ciphertext)
  const charlie_second_message = keys.break_rsa(keys.e, keys.n, bob_ciphertext)
  console.log("")
  console.log(`Charlie gets public keys e: ${keys.e}, n:${keys.n} and Alice's ciphertext ${alice_ciphertext} \n computes message ${charlie_first_message}`)
  console.log("")
  console.log(`Charlie gets public keys e: ${keys.e}, n:${keys.n} and Alice's ciphertext ${bob_ciphertext} \n computes message ${charlie_second_message}`)

}