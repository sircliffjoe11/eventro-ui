import React from 'react';
import { Calendar, Search, Star, Users, Utensils, Volume2, Palette, Shield, Mic, Camera, Lightbulb, Car, Chrome as Broom } from 'lucide-react';

function App() {
  const categories = [
    { id: 1, name: 'Catering', icon: Utensils, description: 'Professional food and beverage services' },
    { id: 2, name: 'Sound System', icon: Volume2, description: 'Audio equipment and sound engineering' },
    { id: 3, name: 'Interior Decor', icon: Palette, description: 'Event decoration and styling services' },
    { id: 4, name: 'Security', icon: Shield, description: 'Professional security and crowd control' },
    { id: 5, name: 'MC/Compere', icon: Mic, description: 'Master of ceremonies and entertainment' },
    { id: 6, name: 'Photography', icon: Camera, description: 'Professional event photography' },
    { id: 7, name: 'Lighting', icon: Lightbulb, description: 'Stage and ambient lighting solutions' },
    { id: 8, name: 'Transportation', icon: Car, description: 'Guest transportation and logistics' }
  ];

  const featuredServices = [
    {
      id: 1,
      title: 'Professional Sound System for Events',
      category: 'Sound System Rental',
      vendor: 'SoundWave Productions',
      location: 'Lagos, Nigeria',
      price: 150000,
      rating: 4.9,
      reviews: 23,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      instantBook: true
    },
    {
      id: 2,
      title: 'Wedding DJ & Entertainment',
      category: 'MC/Compere',
      vendor: 'DJ Master Mix',
      location: 'Abuja, Nigeria',
      price: 200000,
      rating: 4.7,
      reviews: 45,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      instantBook: false
    },
    {
      id: 3,
      title: 'Premium Catering Services',
      category: 'Catering',
      vendor: 'Elite Catering',
      location: 'Port Harcourt, Nigeria',
      price: 2500000,
      rating: 4.8,
      reviews: 67,
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      instantBook: true
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const generateStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-green-600">Eventro e-Hub</span>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search event services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Browse Services</a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">For Vendors</a>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Find Perfect Event Services in Nigeria
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Connect with trusted vendors for catering, decoration, entertainment, and more. 
                Book with confidence, pay securely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Browse Services
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Become a Vendor
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-3xl p-12 backdrop-blur-sm">
                <Calendar className="w-24 h-24 mx-auto mb-4 text-white" />
                <p className="text-xl font-semibold">Your Event, Perfectly Planned</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular Event Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
            <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
              View All →
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white transition-colors">
                    <Star className="w-5 h-5 text-gray-600" />
                  </button>
                  {service.instantBook && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Instant Book
                    </span>
                  )}
                </div>
                
                <div className="p-6">
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {service.category}
                  </span>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-2">
                      {generateStars(service.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {service.rating} ({service.reviews} reviews)
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    {service.location}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold text-green-600">
                        From {formatPrice(service.price)}
                      </div>
                      <div className="text-sm text-gray-500">per service</div>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Browse & Search</h3>
              <p className="text-gray-600">
                Find the perfect service providers for your event needs across Nigeria.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Book & Pay Deposit</h3>
              <p className="text-gray-600">
                Secure your booking with a small deposit. Pay the balance after your event.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Enjoy & Review</h3>
              <p className="text-gray-600">
                Experience amazing service and help others by leaving honest reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <Calendar className="w-8 h-8 text-green-500 mr-2" />
                <span className="text-xl font-bold text-green-500">Eventro e-Hub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Nigeria's premier event services marketplace. Connecting event organizers with trusted service providers nationwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Event Organizers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">My Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">List Your Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Eventro e-Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;