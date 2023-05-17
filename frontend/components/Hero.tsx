import Link from "next/link"

const Hero = () => {
  return (
    <section className="flex gap-[5vw] mt-10 mx-[13%] items-center justify-center">
        <div className="flex-1">
            {/* Borrar desde aqui */}
            <h1 className="text-3xl font-bold">FALTA:</h1>
            <ul>
                <li className="list-disc">Crear colección</li>
            </ul>
            <br/>
            <h1 className="text-3xl font-bold">BUGS/DUDAS:</h1>
            <ul>
                <li className="list-disc">Por qué no se me muestran los tokenID de los NFT en collection</li>
                <li className="list-disc">El manejo de login funciona de aquella manera</li>
                <li className="list-disc">Alchemy solo me devuelve 100 NFTS</li>
            </ul>
            <br/><br/>
            {/* Borrar hasta aqui */}
            <h2 className="text-primary font-bold text-5xl mb-5">Explora y tradea NFTs</h2>

            <p className="mb-4">Con Disrup3 marketplace podrás apoyar a tus creadores favoritos
                de la forma mas descentralizada y segura posible
            </p>

            <div>
                <Link href="/explore">
                    <button className="btn btn-accent mr-3 w-[100px]">Explore</button>
                </Link>                
                <button className="btn btn-secondary ml-3 w-[100px]">Create</button>
            </div>
        </div>

        <div className="flex-1  hidden md:block">
            <div className="card w-67 bg-base bg-opacity-10 shadow-xl">
                <img className="w-[100%]" src="https://i.seadn.io/gae/g5F9JPoY89D-KoeC6_WmX5NeH6SC7naKlDoie_vEupQ8R2OO_Kf_C5l2RUFe3GiKTBQCyioYRNtXujAUhErmWhysJJATB35ajsKuXA" alt="mrcryptoBase"/>
                <div className="card-body">
                    <h3 className="">Mr crypto</h3>
                    <p>Mr. Crypto #2502</p>
                </div>                
            </div>
        </div>
    </section>
  )
}

export default Hero