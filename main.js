const bigInt = require("big-integer");
const readline = require('readline')

class RSA{
    constructor(){
      this.p = undefined
      this.q = undefined
      this.n = undefined
      this.e = undefined
      this.r = undefined
      this.d = undefined     
    }
    sieve_of_eratosthenes(n) {
      const primes = []
      for (let i = 0; i <= n; i++) {
        primes[i] = true
      }
      
      primes[0] = false
      primes[1] = false
      
      for (let i = 2; i <= Math.sqrt(n); i++) {
        for (let j = 2; i * j <= n; j++) {
          primes[i * j] = false
        }
      }
      
      const result = []
      for (let i = 0; i < primes.length; i++) {
        if (primes[i]) result.push(i)
      }
      return result
    }
    gcd(x, y) {
      x = Math.abs(x)
      y = Math.abs(y)
      while(y) {
        var t = y
        y = x % y
        x = t
      }
      return x
    }

    random_prime_number(primes,e){
      const primes_less_r = primes.filter(prime => prime < e)
      const random_index = Math.floor(Math.random() * primes_less_r.length)
      const random_prime = primes_less_r[random_index]
      const gcd_check = this.gcd(random_prime,e)
      if(gcd_check===1){
        return random_prime
      }else{
        return this.random_prime_number(primes,e)
      }  
    }

    extended_euclidean(e,r_input,first_row_one_curry,first_row_two_curry, second_row_one_curry, second_row_two_curry,curry_r){
      if(second_row_one_curry===1){
          return second_row_two_curry
      }
      const r = curry_r||r_input
      // init table  
      let first_row_one = first_row_one_curry||r
      let first_row_two = first_row_two_curry||r
  
      let second_row_one = second_row_one_curry||e
      let second_row_two = second_row_two_curry||1
  
      // first
      const divider = Math.floor(first_row_one/second_row_one)
  
      //second
      const second_row_one_mult = second_row_one*divider
      const second_row_two_mult = second_row_two*divider
  
      // third
      const second_row_one_sub = first_row_one - second_row_one_mult
      const second_row_two_sub = first_row_two - second_row_two_mult
  
      first_row_one = second_row_one
      first_row_two = second_row_two
      second_row_one = second_row_one_sub
      second_row_two = second_row_two_sub
  
  
      const mod =(n, m)=>  ((n % m) + m) % m
  
      if(second_row_two_sub<0){
          second_row_two = curry_r ? mod(second_row_two_sub,curry_r) :  mod(second_row_two_sub,r)
      }
      return this.extended_euclidean(undefined,undefined,first_row_one,first_row_two,second_row_one,second_row_two, r)
    }
  
    calculate_keys(){
      const prime_numbers = this.sieve_of_eratosthenes(500)
      console.log(prime_numbers[prime_numbers.length-1])
      // generate two prime numbers
      this.p = prime_numbers[prime_numbers.length-1]
      this.q = prime_numbers[prime_numbers.length-2]
  
      this.n = this.p*this.q
  
      this.r = (this.p-1)*(this.q-1) 
  
      this.e = this.random_prime_number(prime_numbers, this.r)
       //this.e = 47
       //this.e = 23
   
      // e r 7 / 40
      this.d = this.extended_euclidean(this.e,this.r)
      console.log(this.d+" this.d")
      console.log(this.e+" this.e")
      if((this.e*this.d)%this.r!==1){
        console.log("does not work!")
      }
    }
    encrypt(e,n,message){
      console.log("========")
      console.log(n, message,e)
      const power = bigInt(message).pow(e)
      const encrypt_messsage = bigInt(power).mod(bigInt(n))
      return encrypt_messsage
    }
    decrypt(c,d,n){
      console.log("///////////")
      console.log(c, d,n)
      const power = bigInt(c).pow(d)
      const decrypt_message = bigInt(power).mod(bigInt(n))
      return Number(decrypt_message)
    }
    encode(str) {
      const codes = str
        .split('')
        .map(i => i.charCodeAt())
        .join('')
    
      return codes
    }
    
    decode(code) {
      const stringified = code.toString();
      let string = '';
    
      for (let i = 0; i < stringified.length; i += 2) {
        const num = Number(stringified.substr(i, 2));
        
        if (num <= 30) {
          string += String.fromCharCode(Number(stringified.substr(i, 3)));
          i++;
        } else {
          string += String.fromCharCode(num);
        }
      }
    
      return string;
    }
    encrypt(e,n,message){
      console.log("========")
      console.log(n, message,e)
      const power = bigInt(message).pow(e)
      const encrypt_messsage = Number(bigInt(power).mod(bigInt(n)))
      return encrypt_messsage
    }
  }



const break_rsa=(e,n,c)=>{
  const multiple_all_primes = (primes)=>{
    let store = {}
    for(let i =0;i<primes.length;i++){
      const first = primes[i]
      for(let j = 0;j<primes.length;j++){
        const second = primes[j]
        const multip = first*second
        store[multip] = [first,second]
      }
    }
    return store
  }
  // find d
  const keys = new RSA()
  const primes = keys.sieve_of_eratosthenes(500)
  const primes_mult = multiple_all_primes(primes)
  const p = primes_mult[n][0]
  const q = primes_mult[n][1]
  const r = (p-1)*(q-1) 
  const d = keys.extended_euclidean(e,r)
  console.log(d)
  // decrypt message
  const power = bigInt(c).pow(d)
  const decrypt_message = Number(bigInt(power).mod(bigInt(n)))
  console.log(keys.decode(decrypt_message), "Hack")
  return decrypt_message 
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Please write your message no longer than two characters  `, (m) => {
  console.log(`Hi ${m}!`)
  main(m)
  rl.close()
})

const main=function(m){
  const keys = new RSA()
  keys.calculate_keys()
  console.log(m)
  const message = keys.encode(m)
  const alice_ciphertext = keys.encrypt(keys.e,keys.n,message)
  const bob_decrypt = keys.decrypt(alice_ciphertext,keys.d,keys.n)
  console.log(alice_ciphertext,keys.decode(bob_decrypt))

  break_rsa(keys.e,keys.n,alice_ciphertext)

 }



module.exports = RSA