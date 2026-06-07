export interface Area {
  slug: string;
  name: string;
  zone: "Central" | "North" | "South" | "East" | "West";
  pincode?: string;
  nearby?: string[];
}

export const AREAS: Area[] = [
  { slug: "indiranagar", name: "Indiranagar", zone: "East", pincode: "560038", nearby: ["Domlur", "CV Raman Nagar", "Ulsoor"] },
  { slug: "koramangala", name: "Koramangala", zone: "South", pincode: "560034", nearby: ["HSR Layout", "BTM Layout", "Ejipura"] },
  { slug: "hsr-layout", name: "HSR Layout", zone: "South", pincode: "560102", nearby: ["Koramangala", "Bellandur", "BTM Layout"] },
  { slug: "whitefield", name: "Whitefield", zone: "East", pincode: "560066", nearby: ["ITPL", "Kadugodi", "Varthur"] },
  { slug: "marathahalli", name: "Marathahalli", zone: "East", pincode: "560037", nearby: ["Bellandur", "Brookefield", "AECS Layout"] },
  { slug: "btm-layout", name: "BTM Layout", zone: "South", pincode: "560076", nearby: ["JP Nagar", "Koramangala", "Bommanahalli"] },
  { slug: "jayanagar", name: "Jayanagar", zone: "South", pincode: "560011", nearby: ["JP Nagar", "Basavanagudi", "Banashankari"] },
  { slug: "jp-nagar", name: "JP Nagar", zone: "South", pincode: "560078", nearby: ["Jayanagar", "Bannerghatta Road", "BTM Layout"] },
  { slug: "bellandur", name: "Bellandur", zone: "East", pincode: "560103", nearby: ["Sarjapur Road", "Marathahalli", "HSR Layout"] },
  { slug: "sarjapur-road", name: "Sarjapur Road", zone: "East", pincode: "560035", nearby: ["Bellandur", "HSR Layout", "Wipro Junction"] },
  { slug: "electronic-city", name: "Electronic City", zone: "South", pincode: "560100", nearby: ["Bommanahalli", "HSR Layout", "Hosa Road"] },
  { slug: "banashankari", name: "Banashankari", zone: "South", pincode: "560070", nearby: ["JP Nagar", "Padmanabhanagar", "Kumaraswamy Layout"] },
  { slug: "rajajinagar", name: "Rajajinagar", zone: "West", pincode: "560010", nearby: ["Malleshwaram", "Vijayanagar", "Basaveshwaranagar"] },
  { slug: "malleshwaram", name: "Malleshwaram", zone: "Central", pincode: "560003", nearby: ["Rajajinagar", "Yeshwanthpur", "Sadashivanagar"] },
  { slug: "yelahanka", name: "Yelahanka", zone: "North", pincode: "560064", nearby: ["Hebbal", "Jakkur", "Doddaballapur Road"] },
  { slug: "hebbal", name: "Hebbal", zone: "North", pincode: "560024", nearby: ["Yelahanka", "RT Nagar", "Manyata Tech Park"] },
  { slug: "kalyan-nagar", name: "Kalyan Nagar", zone: "East", pincode: "560043", nearby: ["Banaswadi", "HRBR Layout", "Hennur"] },
  { slug: "mg-road", name: "MG Road", zone: "Central", pincode: "560001", nearby: ["Brigade Road", "Ulsoor", "Shivaji Nagar"] },
  { slug: "mahadevapura", name: "Mahadevapura", zone: "East", pincode: "560048", nearby: ["KR Puram", "Whitefield", "ITPL"] },
  { slug: "kr-puram", name: "KR Puram", zone: "East", pincode: "560036", nearby: ["Mahadevapura", "Tin Factory", "Old Madras Road"] },
  { slug: "bannerghatta-road", name: "Bannerghatta Road", zone: "South", pincode: "560076", nearby: ["JP Nagar", "Arekere", "Gottigere"] },
  { slug: "kanakapura-road", name: "Kanakapura Road", zone: "South", pincode: "560062", nearby: ["Banashankari", "Konanakunte", "Vasanthapura"] },
  { slug: "yeshwanthpur", name: "Yeshwanthpur", zone: "West", pincode: "560022", nearby: ["Malleshwaram", "Peenya", "Mathikere"] },
  { slug: "peenya", name: "Peenya", zone: "West", pincode: "560058", nearby: ["Yeshwanthpur", "Jalahalli", "Nelamangala Road"] },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);