export default function GtHolidaysPage() {
  return (
    <div>
      <div className="bg-black text-white text-sm px-6 py-5">
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            {/*icons*/}
            <a href="https://facebook.com"> <img src="/facebook (2).png" alt="Facebook" className="w-6 h-6" /></a>
            <a href="https://instagram.com"><img src="/instagram.png" alt="Instagram" className="w-6 h-6" /></a>
          </div>
          <a href="mailto:mail@gtholidays.in" className="hover:underline">
            mail@gtholidays.in
          </a>
        </div>
      </div>
       {/* header */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md">
        <img src="/gtholidays.png" alt="gtholidays Logo" className="h-14" />
        <ul className="flex gap-6 font-semibold">
          <li><a href="#">HOME</a></li>
          <li><a href="#">COMPANY</a></li>
          <li><a href="#">GROUP TOURS</a></li>
          <li><a href="#">PACKAGES</a></li>
          <li><a href="#">INDIA</a></li>
          <li><a href="#">HONEYMOON</a></li>
          <li><a href="#">WEDDING</a></li>
          <li><a href="#">CONTACT</a></li>
        </ul>
      </nav>
      <div
        className="relative w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('/background image.png')" }}
      >
        <div className="absolute top-1/4 left-12 bg-yellow-400 p-4 rounded shadow-lg text-black font-bold text-xl">
          Enjoy Stress Free <br/>
          Group Tours with GT
        </div>
        <div className="absolute top-1/2 right-12 bg-yellow-400 p-4 rounded shadow-lg text-black font-bold text-xl">
         Stress-free... <br/>
        Group Tours By GT
        </div>
      </div>
      <div className="px-10 py-12">
        <h1 className="text-3xl font-bold mb-2">Ultimate Group Tour Adventures</h1>
        <h2 className="text-xl text-gray-600 mb-8">Winter Groups for 2025</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="shadow-lg rounded overflow-hidden">
            <img src="/Dubai.png" alt="Dubai Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">Sharjah | Abu Dhabi | Dubai</p>
              <h3 className="font-bold text-lg">Dubai Group Departure Ex</h3>
               <p className="text-yellow-600 font-semibold mt-2">⏱ 4 Nights 5 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <img src="/Europe.png" alt="Europe Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                Paris | Zurich | Seefeld | Axams | Padova | Arezzo | Rome
              </p>
              <h3 className="font-bold text-lg">Europe Winter Group Departure</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 9 Nights 10 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <img src="/london.png" alt="London Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">
                Paris | Zurich | Seefeld | Axams | Padova | Arezzo | Rome
              </p>
              <h3 className="font-bold text-lg">Europe Winter Group Departure Ex Bangalore</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 9 Nights 10 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden relative">
            <img src="/Singapore.png" alt="Singapore Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">Singapore | Malaysia | Kuala Lumpur</p>
              <h3 className="font-bold text-lg">Malaysia Group Departure Ex Chennai</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 6 Nights 7 Days</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="shadow-lg rounded overflow-hidden">
            <img src="/Baku.png" alt="Baku Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">Baku</p>
              <h3 className="font-bold text-lg">Blissful Baku Group Tour Ex Chennai</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 4 Nights 5 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <img src="/Thailand.png" alt="Thailand Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">Bangkok | Pattaya</p>
              <h3 className="font-bold text-lg">Thailand Group Departure Ex Chennai</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 3 Nights 4 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden">
            <img src="/Bali.png" alt="Bali Tour" className="w-full h-56 object-cover" />
            <div className="p-4">
              <p className="text-gray-600 text-sm">Bali</p>
              <h3 className="font-bold text-lg">Beautiful Bali Group Tour Ex Chennai</h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 4 Nights 5 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden relative">
            <img src="/vietnam.png" alt="Vietnam Tour" className="w-full h-56 object-cover" />
            <div className="p-4 pb-14">
              <p className="text-gray-600 text-sm">Hanoi | Ha Long Bay | Da Nang | Siem Reap</p>
              <h3 className="font-bold text-lg">
                Vietnam And Cambodia Group Departure Ex Chennai
              </h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 7 Nights 8 Days</p>
            </div>
          </div>

          <div className="shadow-lg rounded overflow-hidden relative">
            <img src="/Sri lanka.png" alt="Sri Lanka Tour" className="w-full h-56 object-cover" />
            <div className="p-4 pb-14">
              <p className="text-gray-600 text-sm">Kandy | Nuwara Eliya | Bentota | Colombo</p>
              <h3 className="font-bold text-lg">
                Best Of Sri Lanka Group Departure Ex Chennai
              </h3>
              <p className="text-yellow-600 font-semibold mt-2">⏱ 4 Nights 5 Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[500] bg-cover bg-center px-10 py-16 bg-gray-50 "
      style={{backgroundImage:"url('/form page bg.png')"}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col items-start justify-center md:ml-10">
            <h2 className="text-2xl font-semibold mb-4">Stay Connected</h2>
            <div className="flex items-center mb-4">
              <span className="text-xl mr-3"><img src="/telephone.png" alt="phone" className="w-5 h-5"/></span>
              <a href="tel:+919940882200" className="text-lg font-medium text-gray-700">
                +91 9940882200
              </a>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-3"><img src="/gmail.png" alt="gmail" className="w-5 h-5"/></span>
              <a href="mailto:mail@gtholidays.in" className="text-lg font-medium text-gray-700">
                mail@gtholidays.in
              </a>
            </div>
          </div>
          {/* Form*/}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Book Your Dream Vacay Today!</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="text" placeholder="City of Residence" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="email" placeholder="Email" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="tel" placeholder="Phone Number" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="text" placeholder="Travel Destination" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="date" placeholder="Date of Travel" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="number" placeholder="No. of People" className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <input type="number" placeholder="Vacancy Type " className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" />    
              <button type="submit"className=" w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg shadow-md transition duration-300">Submit</button>
            </form>
          </div>
        </div>
      </div>
      {/*Footer*/}
      <footer className="bg-black text-white px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">Corporate Office</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              GT Holidays Pvt LTD, <br />
              Novel Tech Park, <br />
              Opposite to 1 MG Mall, <br />
              MG Road, Bangalore - 560042 <br />
              Karnataka, India.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Head Office</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              GT Holidays Pvt LTD, <br />
              No.1, Gemini Parsn, <br />
              Kodambakkam High Road, <br />
              Nungambakkam, Chennai - 600006 <br />
              Tamil Nadu, India.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Branches</h3>
            <div className="grid grid-cols-2 gap-y-2 text-gray-300 text-sm">
              <span>Mumbai</span>
              <span>Trichy</span>
              <span>Hyderabad</span>
              <span>Salem</span>
              <span>Bangalore</span>
              <span>Kochi</span>
              <span>Chennai</span>
              <span>Vellore</span>
              <span>Coimbatore</span>
              <span>Pondicherry</span>
              <span>Erode</span>
              <span>Nagercoil</span>
              <span>Madurai</span>
              <span>Kanyakumari</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Call Us</h4>
              <a href="tel:+919940882200" className="text-yellow-400 font-medium">
                +91 9940882200
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email Us</h4>
              <a href="mailto:mail@gtholidays.in" className="text-yellow-400 font-medium">
                mail@gtholidays.in
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <div className="flex gap-4 text-gray-400 text-xl">
                <a href="#"><img src="/facebook (2).png" alt="Facebook" className="w-5 h-5" /></a>
                <a href="#"><img src="/instagram (1).png" alt="Instagram" className="w-5 h-5" /></a>
                <a href="#"><img src="/linkedin.png" alt="LinkedIn" className="w-5 h-5" /></a>
                <a href="#"><img src="/youtube.png" alt="YouTube" className="w-5 h-5" /></a>
                <a href="#"><img src="/google.png" alt="Google" className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>Copyright © 2025 by GT Holidays Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Cancellation & Refund Policy</a>
          </div>
        </div>
      </footer>
      <a href="https://wa.me/919876543210" className="fixed bottom-6 left-6 bg-green-500 p-4 rounded-full shadow-lg">
        <img src="/whatsapp.png" alt="WhatsApp" className="h-8" />
      </a>
      <a href="/enquiry" className="fixed bottom-6 right-6 bg-yellow-400 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition">
        ENQUIRE NOW
      </a>
    </div>
  );
}
