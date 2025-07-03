import React, { useState, useEffect} from 'react';
import Testimonials from '../components/Testimonials';
import FeatureCards from '../components/FeatureCards';
import { Link,useNavigate } from 'react-router';

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate =useNavigate();
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "CreativeMinds",
      image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20blonde%20hair%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20warm%20expression%2C%20business%20attire&width=80&height=80&seq=5&orientation=squarish",
      text: "Doist has completely transformed how our marketing team collaborates. We've increased productivity by 35% since implementing it across our department."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      company: "TechNova",
      image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20with%20glasses%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20warm%20expression%2C%20business%20casual%20attire&width=80&height=80&seq=6&orientation=squarish",
      text: "The intuitive interface and powerful features make Doist stand out from other productivity tools. It's become an essential part of our product development workflow."
    },
    {
      id: 3,
      name: "Amelia Rodriguez",
      role: "Freelance Designer",
      company: "Self-employed",
      image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latina%20woman%20with%20dark%20hair%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20warm%20expression%2C%20creative%20casual%20attire&width=80&height=80&seq=7&orientation=squarish",
      text: "As a freelancer juggling multiple clients, Doist helps me stay organized and never miss a deadline. The mobile app is particularly helpful when I'm on the go."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((activeTestimonial) => (activeTestimonial + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 z-50 relative">
        <div className="text-xl font-bold">todo.</div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="#" className="hover:text-gray-300 transition-colors cursor-pointer">Features</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors cursor-pointer">For Teams</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors cursor-pointer">Pricing</Link>
          <div className="relative group">
            <button className="flex items-center hover:text-gray-300 transition-colors cursor-pointer">
              Resources <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hover:text-gray-300 transition-colors cursor-pointer">Login</Link>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-400 transition-all shadow-lg shadow-purple-500/20 !rounded-button whitespace-nowrap cursor-pointer"
          onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section with Spline Background */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 pt-16 pb-32 overflow-hidden h-screen">
        {/* Spline Background - subtle and behind content */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
          <spline-viewer 
            url="https://prod.spline.design/hefQOhZ1Dz8HHA-u/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            loading-anim
            events-target="global"
             
          ></spline-viewer>
        </div>
        
        {/* Gradient overlay to make it more subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/30 z-0"></div>

        {/* Content - positioned above the Spline background */}
        <div className="relative z-10">
          {/* Customer satisfaction indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex -space-x-2 mr-3">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20blonde%20hair%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting&width=40&height=40&seq=1&orientation=squarish" 
                alt="Customer" 
                className="w-8 h-8 rounded-full border-2 border-black object-cover"
              />
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20man%20with%20hat%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting&width=40&height=40&seq=2&orientation=squarish" 
                alt="Customer" 
                className="w-8 h-8 rounded-full border-2 border-black object-cover"
              />
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20woman%20with%20brown%20hair%20smiling%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting&width=40&height=40&seq=3&orientation=squarish" 
                alt="Customer" 
                className="w-8 h-8 rounded-full border-2 border-black object-cover"
              />
            </div>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className={`far fa-star text-xs ${star <= 4 ? 'text-white' : 'text-gray-500'}`}></i>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-300">100K+ Satisfied Customers</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight max-w-4xl">
            Organize your <br />
            <span className="italic font-normal">work</span> and <span className="italic font-normal">life</span>.
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10">
            Simplify life for both you and your team.
            <br />The most productive todo list app.
          </p>
          
          <button 
            className={`bg-orange-500 backdrop-blur-md text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg ${isHovered ? 'shadow-purple-500/30 scale-105' : 'shadow-purple-500/10'} !rounded-button whitespace-nowrap cursor-pointer`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Task Manager Preview */}
      <div className="relative mx-auto max-w-5xl px-6 -mt-20 -mb-40 z-10">
  <div className="bg-white/1 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/10">
    <div className="flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white/10 backdrop-blur-lg border-r border-white/10 p-4">
        <div className="flex items-center mb-6 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2">
            <img 
              src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20woman%20with%20dark%20hair%20against%20a%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting&width=32&height=32&seq=4&orientation=squarish" 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span className="font-medium text-white">Denise</span>
          <i className="fas fa-chevron-down ml-2 text-xs text-gray-300"></i>
        </div>

        <button className="flex items-center w-full bg-orange-500 text-white rounded-md px-3 py-2 mb-6 whitespace-nowrap cursor-pointer">
          <i className="fas fa-plus mr-2 text-sm"></i>
          <span>Add task</span>
        </button>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-300 hover:text-white px-2 py-1.5 rounded cursor-pointer">
            <i className="fas fa-search w-5 text-center mr-2"></i>
            <span>Search</span>
          </div>
          <div className="flex items-center text-gray-300 hover:text-white px-2 py-1.5 rounded cursor-pointer">
            <i className="fas fa-inbox w-5 text-center mr-2"></i>
            <span>Inbox</span>
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 rounded cursor-pointer">
            <i className="fas fa-calendar-day w-5 text-center mr-2 text-orange-500"></i>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 backdrop-blur-lg bg-white/5 rounded-r-xl">
        <div className="text-gray-300 text-sm mb-4 opacity-40">
          ** This is just a preview of the task manager.
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">Today</h2>
          <button className="text-gray-300 hover:text-white cursor-pointer">
            <i className="fas fa-columns mr-1"></i>
            <span>View</span>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-300 text-sm font-medium mb-3">My Projects</h3>

          <div className="group flex items-start mb-4 hover:bg-white/10 hover:backdrop-blur-md p-2 rounded-md cursor-pointer">
            <div className="mt-0.5 mr-3">
              <div className="w-5 h-5 border border-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center text-white">
                <span className="font-medium">Do 30 minutes of yoga</span>
                <i className="fas fa-fire text-yellow-500 ml-2 text-sm"></i>
              </div>
              <div className="flex items-center text-sm text-gray-300 mt-1">
                <i className="far fa-clock mr-1"></i>
                <span>7:30 AM</span>
                <i className="fas fa-redo-alt mx-1 text-xs"></i>
              </div>
            </div>
            <div>
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full"># Fitness</span>
            </div>
          </div>

          <div className="group flex items-start mb-4 hover:bg-white/10 hover:backdrop-blur-md p-2 rounded-md cursor-pointer">
            <div className="mt-0.5 mr-3">
              <div className="w-5 h-5 border border-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center text-white">
                <span className="font-medium">Review quarterly report</span>
              </div>
              <div className="flex items-center text-sm text-gray-300 mt-1">
                <i className="far fa-clock mr-1"></i>
                <span>10:00 AM</span>
              </div>
            </div>
            <div>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full"># Work</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>


      {/* Features Section */}
      <FeatureCards/>

      {/* Testimonials Section */}
      <Testimonials/>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="text-2xl font-bold mb-6">doist.</div>
              <p className="text-gray-400 mb-6">Organize your work and life, finally.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <i className="fab fa-linkedin-in text-lg"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">For Teams</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Enterprise</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 Doist Inc. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400">
                <i className="fab fa-cc-visa text-2xl mr-2"></i>
                <i className="fab fa-cc-mastercard text-2xl mr-2"></i>
                <i className="fab fa-cc-paypal text-2xl mr-2"></i>
                <i className="fab fa-cc-apple-pay text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;