import CustomButton from "./CustomButton"
import NftCard from "./NftCard";

const Hero = () => {
  return (
    <section className="flex gap-[5vw] mt-10 mx-[13%] items-center">
        <div>
            {/* Borrar desde aqui */}
            <h1 className="text-3xl font-bold">BUGS/DUDAS:</h1>
            <ul>
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
                <CustomButton to="/explore">Explore</CustomButton>                
                <CustomButton to="/addCollection">Create</CustomButton>
            </div>
        </div>
        <div className="hidden md:block lg:block xl:block 2xl:block">
            <NftCard
                id={4331}
                name="MRC de Pablo"
                imgUrl="https://i.seadn.io/gae/g5F9JPoY89D-KoeC6_WmX5NeH6SC7naKlDoie_vEupQ8R2OO_Kf_C5l2RUFe3GiKTBQCyioYRNtXujAUhErmWhysJJATB35ajsKuXA"
            />
        </div>
    </section>
  );
}

export default Hero