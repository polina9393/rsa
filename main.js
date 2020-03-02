function sieveOfEratosthenes(n) {
    var primes = [];
    for (var i = 0; i <= n; i++) {
      primes[i] = true;
    }
    
    primes[0] = false;
    primes[1] = false;
    
    for (var i = 2; i <= Math.sqrt(n); i++) {
      for (j = 2; i * j <= n; j++) {
        primes[i * j] = false;
      }
    }
    
    var result = [];
    for (var i = 0; i < primes.length; i++) {
      if (primes[i]) result.push(i);
    }
    
    return result;
  }

  function random_prime_number(primes,max){
    const primes_less_r = primes.filter(prime => prime < max)
    const random_index = Math.floor(Math.random() * primes_less_r.length)
    const random_prime = primes_less_r[random_index]
    return random_prime
  }
  // 7, 40
  function extended_euclidean(e,r_input,first_row_one_curry,first_row_two_curry, second_row_one_curry, second_row_two_curry,curry_r){
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


    function mod(n, m) {
        return ((n % m) + m) % m;
      }
    if(second_row_two_sub<0){
        console.log("founddddddddd")
        console.log(second_row_two_sub)
        if(curry_r==undefined){
            second_row_two = mod(second_row_two_sub,r)
        }else{
            second_row_two = mod(second_row_two_sub,curry_r)
        }
        console.log(second_row_two, curry_r, r)
        console.log("cefefeffefe")
    }

    console.log(first_row_one)
    console.log(first_row_two)
    console.log(second_row_one)
    console.log(second_row_two)

    return extended_euclidean(undefined,undefined,first_row_one,first_row_two,second_row_one,second_row_two, r)
  }
  function calculate_d(){
    const prime_numbers = sieveOfEratosthenes(100)
    console.log(prime_numbers)
    // generate two prime numbers
    const p = prime_numbers[3]
    const q = prime_numbers[4]

    // compute n
    const n = p*q

    // compute r
    const r = (p-1)*(q-1) 

    // compute e
    const e = random_prime_number(prime_numbers, r)

    // final step 
    // e r 7 / 40
    const d = extended_euclidean(13,60)
    console.log("////////////////")
    console.log(d)
  }
  calculate_d()
   
  
  //console.log(sieveOfEratosthenes(49))