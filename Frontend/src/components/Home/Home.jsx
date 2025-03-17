import React from 'react'
import Header from './Header';
import Footer from './Footer';
import DataSection from './DataSection';
import Career from './Career';
import Bcareer from './Bcareer';
import { OurSkillsSection } from './OurSkillsSection';
import { BannerSection } from './OurSkillsSection';
import CoreValues from './CoreValues';
import Clients from './Clients';


 const Home = () => {
  
  return (
    <div> 
      
<DataSection/>
<Career/>
{/* <Bcareer/> */}
<OurSkillsSection/>
<BannerSection/>
<CoreValues/>
<Clients/>

      



    </div>

  )
}

export default Home;