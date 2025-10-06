"use client";

export default function ShopLocation() {
  return (
    <section className="my-10 p-4 border rounded-lg shadow-sm bg-white ">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Our Shop Location</h2>
      <div className="w-full lg:h-[400px] rounded-md overflow-hidden min-h-[100px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1535.290886230485!2d90.34894117855058!3d23.76314726690959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf62a6e32761%3A0x30d39f9e00d4d66c!2s14%20Haji%20Dil%20Mohammad%20Ave%2C%20Dhaka%201207!5e0!3m2!1sen!2sbd!4v1747062820987!5m2!1sen!2sbd"
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          width={300}
          height={300}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p className="text-center text-gray-600 mt-4">
        📍 14 Haji Dil Mohammad Ave, Dhaka 1207 &nbsp;|&nbsp;
        <a
          href="https://maps.google.com/?q=23.76314726690959,90.34894117855058"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View on Google Maps
        </a>
      </p>
    </section>
  );
}
