// import { generateSeedPhrase } from 'near-seed-phrase';
import { generateSeedPhrase } from  'near-seed-phrase'


export function generateSeed(){
    const seed = generateSeedPhrase();
    console.log(seed)
    return seed;
}


generateSeed();