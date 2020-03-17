const bigInt = require("big-integer")


class RSA {
  constructor() {
    this.p = undefined
    this.q = undefined
    this.n = undefined
    this.e = undefined
    this.r = undefined
    this.d = undefined
    this.prime_numbers = undefined
    this.primes_mult_hash_table = undefined
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
    primes.forEach((el,index)=> el&&result.push(index))

    return result
  }
  gcd(x, y) {
    x = Math.abs(x)
    y = Math.abs(y)
    while (y) {
      let t = y
      y = x % y
      x = t
    }
    return x
  }

  random(e) {
      const next_value = Math.floor(Math.random() * e) + 1

      const gcd_check = this.gcd(next_value, e)

      if (gcd_check === 1) {
        return next_value
      } else {
        return this.random(e, next_value + 1)
      }
    
  }

  extended_euclidean(e, r_input, first_row_one_curry, first_row_two_curry, second_row_one_curry, second_row_two_curry, curry_r) {
    if (second_row_one_curry === 1) {
      return second_row_two_curry
    }
    const r = curry_r || r_input
    // init table  
    let first_row_one = first_row_one_curry || r
    let first_row_two = first_row_two_curry || r

    let second_row_one = second_row_one_curry || e
    let second_row_two = second_row_two_curry || 1

    // first
    const divider = Math.floor(first_row_one / second_row_one)

    //second
    const second_row_one_mult = second_row_one * divider
    const second_row_two_mult = second_row_two * divider

    // third
    const second_row_one_sub = first_row_one - second_row_one_mult
    const second_row_two_sub = first_row_two - second_row_two_mult

    first_row_one = second_row_one
    first_row_two = second_row_two
    second_row_one = second_row_one_sub
    second_row_two = second_row_two_sub


    const mod = (n, m) => ((n % m) + m) % m

    if (second_row_two_sub < 0) {
      second_row_two = curry_r ? mod(second_row_two_sub, curry_r) : mod(second_row_two_sub, r)
    }
    return this.extended_euclidean(undefined, undefined, first_row_one, first_row_two, second_row_one, second_row_two, r)
  }

  calculate_keys() {
    // array of prime numbers
    this.prime_numbers = this.sieve_of_eratosthenes(1000)

    const ran_index_p = Math.floor(Math.random() * (this.prime_numbers.length - 1))
    const ran_index_q = Math.floor(Math.random() * (this.prime_numbers.length - 1))

    // choose two random prime numbers
    this.p = this.prime_numbers[ran_index_p]
    this.q = this.prime_numbers[ran_index_q]
    console.log("RSA")
    console.log("1. As a starting point for RSA choose two primes p and q \n 1st prime p = " + this.p + "\n 2nd prime q = " + this.q)

    this.n = this.p * this.q
    console.log("2. Compute the product of two large primes:\n n = p × q = " + this.n)
    this.r = (this.p - 1) * (this.q - 1)

    this.e = this.random(this.r)
    console.log(`3.Choose random e that it is less ${this.r}`)
    console.log(`and having no factor in common with n ${this.n}. \n e = ${this.e}`)

    this.d = this.extended_euclidean(this.e, this.r)

    console.log("For the chosen values of p, q, and e, we get \n d = " + this.d)

  }
  module_expomentiaton(base,power,mod){
    if(power==1){
        return base
    }
  
    if(power%2==0){
      return (this.module_expomentiaton(base,power/2,mod) * this.module_expomentiaton(base,power/2,mod)) % mod
    }else{
      return (this.module_expomentiaton(base,power-1,mod)*base) % mod
    }
  }
  encrypt(e, n, message) {
    return this.module_expomentiaton(message,e,n)
  }
  decrypt(c, d, n) {
    return this.module_expomentiaton(c,d,n)
  }

  encode(character) {
    return character.charCodeAt()
  }

  decode(code) {
    return String.fromCharCode(code)
  }

  break_rsa(e, n, c) {
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
    this.primes_mult_hash_table = multiple_all_primes(this.prime_numbers)
    const p = this.primes_mult_hash_table[n][0]
    const q = this.primes_mult_hash_table[n][1]
    const r = (p - 1) * (q - 1)
    const d = this.extended_euclidean(e, r)
    // decrypt message
    const decrypt_message = this.decrypt(c,d,n)


    // decode to text
    return this.decode(decrypt_message)
  }

}

module.exports = RSA