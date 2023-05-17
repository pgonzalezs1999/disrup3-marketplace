import Link from "next/link"

const Hero = () => {
  return (
    <section className="flex mt-10 mx-[13%] items-center justify-center gap-3">
        <div className="flex-1">
            {/* Borrar desde aqui */}
            <h1 className="text-3xl font-bold">DUDAS:</h1>
            <ul>
                <li className="list-disc">El form reconoce que estoy escribiendo pero no lo guarda ni en el input ni en el objeto</li>
                <li className="list-disc">Por que no se me muestran los tokenID de los NFT en collection</li>
                <li className="list-disc">Por que se ven los Bored Apes pero no los MRC ni los SUJPG</li>
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
            {/** SHOW IMAGE OF MR CRYPTO */}
            <div className="card w-67 bg-base bg-opacity-10 shadow-xl">
                <img className="w-[100%]" src="https://i.seadn.io/gae/FdHndvSm1NaDNylgeezFF8ySxjN_p8Pmv28TcR4klfocPJk42eEvHclaX5-jURSqb1MAUgt-0v_YxI8ARAIzo5bufJI-52sdhP63?auto=format&w=1000" alt="mrcryptoBase" />

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

