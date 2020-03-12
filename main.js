const bigInt = require("big-integer");

const sieve_of_eratosthenes_=(n)=>{
  const primes = [];
  for (let i = 0; i <= n; i++) {
    primes[i] = true;
  }
  
  primes[0] = false;
  primes[1] = false;
  
  for (let i = 2; i <= Math.sqrt(n); i++) {
    for (let j = 2; i * j <= n; j++) {
      primes[i * j] = false;
    }
  }
  
  const result = [];
  for (let i = 0; i < primes.length; i++) {
    if (primes[i]) result.push(i);
  }
  
  return result;
}

class Key{
    constructor(){
      this.p = undefined
      this.q = undefined
      this.n = undefined
      this.e = undefined
      this.r = undefined
      this.d = undefined     
    }
    sieve_of_eratosthenes(n) {
      const primes = [];
      for (let i = 0; i <= n; i++) {
        primes[i] = true;
      }
      
      primes[0] = false;
      primes[1] = false;
      
      for (let i = 2; i <= Math.sqrt(n); i++) {
        for (let j = 2; i * j <= n; j++) {
          primes[i * j] = false;
        }
      }
      
      const result = [];
      for (let i = 0; i < primes.length; i++) {
        if (primes[i]) result.push(i);
      }
      
      return result;
    }
    gcd(x, y) {
      if ((typeof x !== 'number') || (typeof y !== 'number')) 
        return false;
      x = Math.abs(x);
      y = Math.abs(y);
      while(y) {
        var t = y;
        y = x % y;
        x = t;
      }
      return x;
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
      const prime_numbers = this.sieve_of_eratosthenes(100)

      // generate two prime numbers
      this.p = prime_numbers[3]
      this.q = prime_numbers[4]
  
      // compute n
      this.n = this.p*this.q
  
      // compute r
      this.r = (this.p-1)*(this.q-1) 
  
      // compute e
      this.e = this.random_prime_number(prime_numbers, this.r)
       //this.e = 47
       //this.e = 13
  
      // final step 
      // e r 7 / 40
      this.d = this.extended_euclidean(this.e,this.r)
      console.log(this.d+" this.d")
      console.log(this.e+" this.e")
      if((this.e*this.d)%this.r!==1){
        console.log("does not work!")
      }
    }
  }

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

const break_rsa=(e,n,c)=>{
  // find d
  const init = new Key()
  const primes = init.sieve_of_eratosthenes(100)
  const primes_mult = multiple_all_primes(primes)
  const p = primes_mult[n][0]
  const q = primes_mult[n][1]
  const r = (p-1)*(q-1) 
  const d = init.extended_euclidean(e,r)
  console.log(d)
  // decrypt message
  const power = bigInt(c).pow(d)
  const decrypt_message = Number(bigInt(power).mod(bigInt(n)))
  console.log(decrypt_message, "Hack")
  return decrypt_message 
}

function decrypt(c,d,n){
  console.log("///////////")
  console.log(c, d,n)
  const power = bigInt(c).pow(d)
  const decrypt_message = Number(bigInt(power).mod(bigInt(n)))
  return decrypt_message
}
function encrypt(e,n,message){
  console.log("========")
  console.log(n, message,e)
  const power = bigInt(message).pow(e)
  const encrypt_messsage = Number(bigInt(power).mod(bigInt(n)))
  return encrypt_messsage
}

// const data = { coordinates: { x: 5, y: 6 } };

// const { coordinates: { x: xCoord, y: yCoord } } = data;

// console.log(xCoord, yCoord)

const main=function(){
  const keys = new Key()
  keys.calculate_keys()

  const {bob_keys} = keys
  //console.log(d)
  const alice_ciphertext = encrypt(keys.e,keys.n,5)
  console.log("ciphertext "+ alice_ciphertext)
  const bob_decrypt = decrypt(alice_ciphertext,keys.d,keys.n)
  console.log(alice_ciphertext,bob_decrypt)

  break_rsa(keys.e,keys.n,alice_ciphertext)

 }();



module.exports = Key