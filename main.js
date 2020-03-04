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
      var primes = [];
      for (var i = 0; i <= n; i++) {
        primes[i] = true;
      }
      
      primes[0] = false;
      primes[1] = false;
      
      for (var i = 2; i <= Math.sqrt(n); i++) {
        for (var j = 2; i * j <= n; j++) {
          primes[i * j] = false;
        }
      }
      
      var result = [];
      for (var i = 0; i < primes.length; i++) {
        if (primes[i]) result.push(i);
      }
      
      return result;
    }

    random_prime_number(primes,max){
      const primes_less_r = primes.filter(prime => prime < max)
      const random_index = Math.floor(Math.random() * primes_less_r.length)
      const random_prime = primes_less_r[random_index]
      return random_prime
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
      //this.e = 13
  
      // final step 
      // e r 7 / 40
      console.log(this.e)
      this.d = this.extended_euclidean(this.e,this.r)
      if((this.e*this.d)%this.r!==1){
        console.log("does not work!")
      }
    }
  }

  
function main(){
  const bob = new Key()
  bob.calculate_keys()
  
  function alice(e,n){
    const message = 5
    console.log(e+" e")
    console.log(n+" n")
    const encrypt_messsage = (message**e)%n
    console.log(encrypt_messsage+" encrypt_messsage")
    return encrypt_messsage
  }
  function bob_decrypt(c){
    console.log(c + " c")
    console.log(bob.d + " bob.d")
    console.log(bob.n+" bob.n")
    const decrypt_message=bob.n%Number(BigInt(c**bob.d)%BigInt(bob.n))
    return decrypt_message
  }
  const alice_c = alice(bob.e,bob.n)
  const alice_message = bob_decrypt(alice_c)
  console.log(alice_c,alice_message)
 } 
main()