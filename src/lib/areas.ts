export interface Area {
  slug: string;
  name: string;
  zone: "Central" | "North" | "South" | "East" | "West";
  pincode?: string;
  nearby?: string[];
  lat: number;
  lng: number;
}

export const AREAS: Area[] = [
  { slug: "indiranagar", name: "Indiranagar", zone: "East", pincode: "560038", nearby: ["Domlur", "CV Raman Nagar", "Ulsoor"] , lat: 12.9784, lng: 77.6408 },
  { slug: "koramangala", name: "Koramangala", zone: "South", pincode: "560034", nearby: ["HSR Layout", "BTM Layout", "Ejipura"] , lat: 12.9352, lng: 77.6245 },
  { slug: "hsr-layout", name: "HSR Layout", zone: "South", pincode: "560102", nearby: ["Koramangala", "Bellandur", "BTM Layout"] , lat: 12.9116, lng: 77.6389 },
  { slug: "whitefield", name: "Whitefield", zone: "East", pincode: "560066", nearby: ["ITPL", "Kadugodi", "Varthur"] , lat: 12.9698, lng: 77.75 },
  { slug: "marathahalli", name: "Marathahalli", zone: "East", pincode: "560037", nearby: ["Bellandur", "Brookefield", "AECS Layout"] , lat: 12.9569, lng: 77.7011 },
  { slug: "btm-layout", name: "BTM Layout", zone: "South", pincode: "560076", nearby: ["JP Nagar", "Koramangala", "Bommanahalli"] , lat: 12.9166, lng: 77.6101 },
  { slug: "jayanagar", name: "Jayanagar", zone: "South", pincode: "560011", nearby: ["JP Nagar", "Basavanagudi", "Banashankari"] , lat: 12.925, lng: 77.5938 },
  { slug: "jp-nagar", name: "JP Nagar", zone: "South", pincode: "560078", nearby: ["Jayanagar", "Bannerghatta Road", "BTM Layout"] , lat: 12.9063, lng: 77.5857 },
  { slug: "bellandur", name: "Bellandur", zone: "East", pincode: "560103", nearby: ["Sarjapur Road", "Marathahalli", "HSR Layout"] , lat: 12.9304, lng: 77.6784 },
  { slug: "sarjapur-road", name: "Sarjapur Road", zone: "East", pincode: "560035", nearby: ["Bellandur", "HSR Layout", "Wipro Junction"] , lat: 12.901, lng: 77.6874 },
  { slug: "electronic-city", name: "Electronic City", zone: "South", pincode: "560100", nearby: ["Bommanahalli", "HSR Layout", "Hosa Road"] , lat: 12.8452, lng: 77.6602 },
  { slug: "banashankari", name: "Banashankari", zone: "South", pincode: "560070", nearby: ["JP Nagar", "Padmanabhanagar", "Kumaraswamy Layout"] , lat: 12.925, lng: 77.546 },
  { slug: "rajajinagar", name: "Rajajinagar", zone: "West", pincode: "560010", nearby: ["Malleshwaram", "Vijayanagar", "Basaveshwaranagar"] , lat: 12.9911, lng: 77.5522 },
  { slug: "malleshwaram", name: "Malleshwaram", zone: "Central", pincode: "560003", nearby: ["Rajajinagar", "Yeshwanthpur", "Sadashivanagar"] , lat: 13.0035, lng: 77.5709 },
  { slug: "yelahanka", name: "Yelahanka", zone: "North", pincode: "560064", nearby: ["Hebbal", "Jakkur", "Doddaballapur Road"] , lat: 13.1007, lng: 77.5963 },
  { slug: "hebbal", name: "Hebbal", zone: "North", pincode: "560024", nearby: ["Yelahanka", "RT Nagar", "Manyata Tech Park"] , lat: 13.0358, lng: 77.597 },
  { slug: "kalyan-nagar", name: "Kalyan Nagar", zone: "East", pincode: "560043", nearby: ["Banaswadi", "HRBR Layout", "Hennur"] , lat: 13.0246, lng: 77.6408 },
  { slug: "mg-road", name: "MG Road", zone: "Central", pincode: "560001", nearby: ["Brigade Road", "Ulsoor", "Shivaji Nagar"] , lat: 12.9752, lng: 77.606 },
  { slug: "mahadevapura", name: "Mahadevapura", zone: "East", pincode: "560048", nearby: ["KR Puram", "Whitefield", "ITPL"] , lat: 12.991, lng: 77.6994 },
  { slug: "kr-puram", name: "KR Puram", zone: "East", pincode: "560036", nearby: ["Mahadevapura", "Tin Factory", "Old Madras Road"] , lat: 13.0076, lng: 77.6952 },
  { slug: "bannerghatta-road", name: "Bannerghatta Road", zone: "South", pincode: "560076", nearby: ["JP Nagar", "Arekere", "Gottigere"] , lat: 12.8875, lng: 77.5967 },
  { slug: "kanakapura-road", name: "Kanakapura Road", zone: "South", pincode: "560062", nearby: ["Banashankari", "Konanakunte", "Vasanthapura"] , lat: 12.8875, lng: 77.546 },
  { slug: "yeshwanthpur", name: "Yeshwanthpur", zone: "West", pincode: "560022", nearby: ["Malleshwaram", "Peenya", "Mathikere"] , lat: 13.0284, lng: 77.554 },
  { slug: "peenya", name: "Peenya", zone: "West", pincode: "560058", nearby: ["Yeshwanthpur", "Jalahalli", "Nelamangala Road"] , lat: 13.029, lng: 77.515 },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);