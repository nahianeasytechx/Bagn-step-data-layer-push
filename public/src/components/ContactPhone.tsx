import { Phone, ClipboardCopy, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function ContactPhone() {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "01345834990";
  const phoneNumberTwo = "01345834989";

  
  const phone = "01345834990";
  const message = encodeURIComponent("Hi, I'm interested in your shoes!");
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;


  const handleCopy = async () => {
    await navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Phone /> CALL US
      </h3>
      <div className="flex flex-col gap-4">
        {/* Click to Call */}
        <a
          href={`tel:${phoneNumber}`}
          className=" hover:underline flex items-center gap-1"
        >
  
          {phoneNumber}
        </a>
        <a
          href={`tel:${phoneNumber}`}
          className=" hover:underline flex items-center gap-1"
        >
 
          {phoneNumberTwo}
        </a>

        <div className="flex gap-2 mt-2">
              <Link href={"https://www.facebook.com/profile.php?id=100094382247247"} target="_blank" rel="noopener noreferrer">
                <Button variant={'facebook'} className="w-full text-white">
                  Facebook <FaFacebook />
                </Button>
              </Link>
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant={'whatsapp'} className="w-full text-white">
                  WhatsApp <FaWhatsapp />
                </Button>
              </Link>
            </div> 
      </div>
    </div>
  );
}
