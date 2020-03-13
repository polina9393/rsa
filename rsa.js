const bigInt = require("big-integer");

class RSA{
    constructor(){
      this.p = undefined
      this.q = undefined
      this.n = undefined
      this.e = undefined
      this.r = undefined
      this.d = undefined  
      this.prime_numbers = undefined   
    }
    sieve_of_eratosthenes(n) {
      const primes = []
      primes[0] = false
      primes[1] = false
      for (let i = 2; i <= n; i++) {
        primes[i] = true
      }
      
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
        let t = y
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
      this.prime_numbers = this.sieve_of_eratosthenes(500)

      // generate two prime numbers
      this.p = this.prime_numbers[this.prime_numbers.length-1]
      this.q = this.prime_numbers[this.prime_numbers.length-2]
      console.log("RSA")
      console.log("1. As a starting point for RSA choose two primes p and q \n 1st prime p = "+this.p+"\n 2nd prime q = "+this.q)

      this.n = this.p*this.q
      console.log("2. Compute the product of two large primes:\n n = p × q = "+ this.n)
      this.r = (this.p-1)*(this.q-1) 
      
      this.e = this.random_prime_number(this.prime_numbers, this.r)
      console.log(`3.Choose random e that it is less ${this.r}`)
      console.log(`and having no factor
        in common with n ${this.n}. \n e = ${this.e}`)
      this.d = this.extended_euclidean(this.e,this.r)
      console.log("For the chosen values of p, q, and e, we get \n d = "+this.d)

    }
    encrypt(e,n,message){
        const power = bigInt(message).pow(e)
        return Number(bigInt(power).mod(bigInt(n)))
      }
    decrypt(c,d,n){
      const power = bigInt(c).pow(d)
      return Number(bigInt(power).mod(bigInt(n)))
    }
    encode(str) {
      let result = ''  
      for(let i=0;i<str.length;i++){
          result+=str[i].charCodeAt()
      }
      return result
    }
    
    decode(code) {
      const stringified = code.toString()
      let string = ''
    
      for (let i = 0; i < stringified.length; i += 2) {
        const num = Number(stringified.substr(i, 2))
        
        if (num <= 30) {
          string += String.fromCharCode(Number(stringified.substr(i, 3)))
          i++
        } else {
          string += String.fromCharCode(num)
        }
      }
    
      return string
    }

    break_rsa(e, n, c){
        // create all possible primes multiplication
        const multiple_all_primes = (primes) => {
          let store = {}
          for (let i = 0; i < primes.length; i++) {
            const first = primes[i]
            for (let j = 0; j < primes.length; j++) {
              const second = primes[j]
              const multip = first * second
              store[multip] = [first, second]
            }
          }
          return store
        }
        // find d
        //const primes = this.sieve_of_eratosthenes(500)
        const primes_mult = multiple_all_primes(this.prime_numbers)
        const p = primes_mult[n][0]
        const q = primes_mult[n][1]
        const r = (p - 1) * (q - 1)
        const d = this.extended_euclidean(e, r)
        // decrypt message
        const power = bigInt(c).pow(d)
        const decrypt_message = Number(bigInt(power).mod(bigInt(n)))
      
        // decode to text
        return this.decode(decrypt_message)
      }

  }

  module.exports = RSA