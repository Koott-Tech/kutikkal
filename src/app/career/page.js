'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Career() {
  const router = useRouter();

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#f8fafc", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @media (max-width: 768px) {
          .company-name-career {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Company name at left, aligned with navbar */}
      <div
        className="company-name-career"
        style={{
          position: "absolute",
          top: "2.5rem",
          left: "5vw",
          zIndex: 2,
          fontWeight: 900,
          fontSize: "2.2rem",
          color: "#27ae60",
          letterSpacing: "0.05em",
          userSelect: "none",
          textShadow: "0 2px 12px rgba(39,174,96,0.08)",
          cursor: "pointer"
        }}
        onClick={() => router.push('/')}
        title="Go to homepage"
      >
        CureMinds
      </div>
      
      <div style={{ position: "relative", zIndex: 3 }}></div>
      
      <section style={{ width: "100vw", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "8rem", paddingBottom: "4rem" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: 700, color: "#000", textAlign: "center", letterSpacing: "-0.02em", lineHeight: 1.2, maxWidth: 900, marginBottom: "1.5rem" }}>
          Access to better mental health<br />
          care for everyone
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#666", textAlign: "center", maxWidth: 700, fontWeight: 400, margin: 0, marginBottom: "3rem" }}>
          Let's work together to make mental healthcare work the way it should.
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => {
              const element = document.getElementById('openings');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: "#5B3B8D",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 4px 12px rgba(91, 59, 141, 0.2)"
            }}
            onMouseEnter={(e) => e.target.style.background = "#4A2F73"}
            onMouseLeave={(e) => e.target.style.background = "#5B3B8D"}
          >
            See open positions
          </button>
          <button 
            onClick={() => router.push('/guide')}
            style={{
              background: "#5B3B8D",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "16px 32px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
              boxShadow: "0 4px 12px rgba(91, 59, 141, 0.2)"
            }}
            onMouseEnter={(e) => e.target.style.background = "#4A2F73"}
            onMouseLeave={(e) => e.target.style.background = "#5B3B8D"}
          >
            Join our provider network
          </button>
                 </div>
         
                   {/* Team Photos Grid Section */}
          <div style={{ 
            width: "100%", 
            maxWidth: "100%", 
            margin: "4rem auto 0", 
            padding: "0" 
          }}>
           <h2 style={{ 
             fontSize: "2.5rem", 
             fontWeight: 700, 
             color: "#1a1a1a", 
             textAlign: "center", 
             marginBottom: "1rem" 
           }}>
             Meet Our Team
           </h2>
           <p style={{ 
             fontSize: "1.1rem", 
             color: "#666", 
             textAlign: "center", 
             maxWidth: "600px", 
             margin: "0 auto 3rem",
             lineHeight: "1.6"
           }}>
             Our diverse team of professionals works remotely from around the world, bringing together expertise in mental health, technology, and customer care.
           </p>
           
                                                                                                                                                                                               <div style={{ 
                 display: "grid", 
                 gridTemplateColumns: "repeat(4, 1fr)", 
                 gap: "0.5rem",
                 marginBottom: "4rem"
               }}>
                                 {/* Row 1 - 4 people */}
                 <div style={{ 
                   background: "#fff", 
                   borderRadius: "6px", 
                   overflow: "hidden", 
                   boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                   aspectRatio: "0.8",
                   position: "relative"
                 }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👩‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👩‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👩‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👨‍💻
                  </div>
                </div>
                
                {/* Row 2 - 4 people */}
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👨‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👩‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👨‍💻
                  </div>
                </div>
                
                <div style={{ 
                  background: "#fff", 
                  borderRadius: "6px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  aspectRatio: "0.8",
                  position: "relative"
                }}>
                  <div style={{ 
                    width: "100%", 
                    height: "100%", 
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "2.5rem"
                  }}>
                    👩‍💻
                  </div>
                </div>
                

              </div>
         </div>
         
         {/* Why We're Here Section */}
         <div style={{ 
           width: "100%", 
           background: "#fff", 
           padding: "4rem 0",
           marginTop: "4rem"
         }}>
           <div style={{ 
             maxWidth: "1200px", 
             margin: "0 auto", 
             display: "grid", 
             gridTemplateColumns: "1fr 1fr", 
             gap: "4rem", 
             alignItems: "center",
             padding: "0 2rem"
           }}>
             {/* Left Column - Text Content */}
             <div>
               <h2 style={{ 
                 fontSize: "2.5rem", 
                 fontWeight: 700, 
                 color: "#1a1a1a", 
                 marginBottom: "2rem",
                 lineHeight: "1.2"
               }}>
                 Why We're Here
               </h2>
               
               <div style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "#444" }}>
                 <p style={{ marginBottom: "1.5rem" }}>
                   Over 65 million Americans seek mental health help, but 2 out of 3 give up due to a broken and frustrating system.
                 </p>
                 
                 <p style={{ marginBottom: "1.5rem" }}>
                   We must do better. Our team is on a mission to transform mental healthcare and make it accessible to everyone who needs it.
                 </p>
                 
                 <p style={{ marginBottom: "1.5rem" }}>
                   We're building the future of mental healthcare - providing high-quality, affordable care from licensed professionals who truly care.
                 </p>
                 
                 <p style={{ marginBottom: "1.5rem" }}>
                   Our team comes from diverse backgrounds, but we share one passion: helping people access the mental healthcare they deserve.
                 </p>
                 
                 <p style={{ marginBottom: "1.5rem" }}>
                   We're inspired and energized by the impact we're making on the lives of those who entrust us with their care.
                 </p>
               </div>
             </div>
             
             {/* Right Column - Image with Overlay Cards */}
             <div style={{ position: "relative" }}>
               <div style={{ 
                 width: "100%", 
                 height: "500px", 
                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                 borderRadius: "12px",
                 position: "relative",
                 overflow: "hidden"
               }}>
                 {/* Golden Logo */}
                 <div style={{ 
                   position: "absolute", 
                   top: "20px", 
                   left: "20px", 
                   width: "60px", 
                   height: "60px", 
                   background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                   borderRadius: "50%",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   fontSize: "1.5rem",
                   fontWeight: "bold",
                   color: "#fff",
                   zIndex: 2
                 }}>
                   CM
                 </div>
                 
                 {/* Profile Cards Stack */}
                 <div style={{ 
                   position: "absolute", 
                   top: "100px", 
                   left: "20px", 
                   zIndex: 2
                 }}>
                   {/* Card 1 - Isabella Parker */}
                   <div style={{ 
                     background: "#fff", 
                     borderRadius: "8px", 
                     padding: "12px", 
                     marginBottom: "8px", 
                     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                     display: "flex",
                     alignItems: "center",
                     gap: "12px",
                     width: "200px"
                   }}>
                     <div style={{ 
                       width: "40px", 
                       height: "40px", 
                       borderRadius: "50%", 
                       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       color: "#fff",
                       fontSize: "0.9rem",
                       fontWeight: "bold"
                     }}>
                       IP
                     </div>
                     <div>
                       <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1a1a1a" }}>
                         Isabella Parker
                       </div>
                       <div style={{ fontSize: "0.75rem", color: "#666" }}>
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                   
                   {/* Card 2 - Ariyah Richards */}
                   <div style={{ 
                     background: "#fff", 
                     borderRadius: "8px", 
                     padding: "12px", 
                     marginBottom: "8px", 
                     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                     display: "flex",
                     alignItems: "center",
                     gap: "12px",
                     width: "200px"
                   }}>
                     <div style={{ 
                       width: "40px", 
                       height: "40px", 
                       borderRadius: "50%", 
                       background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       color: "#fff",
                       fontSize: "0.9rem",
                       fontWeight: "bold"
                     }}>
                       AR
                     </div>
                     <div>
                       <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1a1a1a" }}>
                         Ariyah Richards
                       </div>
                       <div style={{ fontSize: "0.75rem", color: "#666" }}>
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                   
                   {/* Card 3 - Kimber Bautista */}
                   <div style={{ 
                     background: "#fff", 
                     borderRadius: "8px", 
                     padding: "12px", 
                     marginBottom: "8px", 
                     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                     display: "flex",
                     alignItems: "center",
                     gap: "12px",
                     width: "200px"
                   }}>
                     <div style={{ 
                       width: "40px", 
                       height: "40px", 
                       borderRadius: "50%", 
                       background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       color: "#fff",
                       fontSize: "0.9rem",
                       fontWeight: "bold"
                     }}>
                       KB
                     </div>
                     <div>
                       <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1a1a1a" }}>
                         Kimber Bautista
                       </div>
                       <div style={{ fontSize: "0.75rem", color: "#666" }}>
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Placeholder for woman image */}
                 <div style={{ 
                   position: "absolute", 
                   right: "0", 
                   bottom: "0", 
                   width: "60%", 
                   height: "100%", 
                   background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   color: "#fff",
                   fontSize: "3rem"
                 }}>
                   👩‍💼
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* From our CEO Section */}
         <div style={{ 
           width: "100%", 
           background: "#fff", 
           padding: "4rem 0",
           marginTop: "2rem"
         }}>
           <div style={{ 
             maxWidth: "1200px", 
             margin: "0 auto", 
             padding: "0 2rem"
           }}>
             <h2 style={{ 
               fontSize: "2.5rem", 
               fontWeight: 700, 
               color: "#1a1a1a", 
               textAlign: "center",
               marginBottom: "3rem"
             }}>
               From our CEO
             </h2>
             
             <div style={{ 
               display: "grid", 
               gridTemplateColumns: "1fr 1fr", 
               gap: "4rem", 
               alignItems: "center"
             }}>
               {/* Left Column - Message */}
               <div>
                 <p style={{ 
                   fontSize: "1.2rem", 
                   lineHeight: "1.8", 
                   color: "#444", 
                   marginBottom: "2rem"
                 }}>
                   Our mission is to make mental healthcare work for everyone and we can only achieve this by building, and nurturing, the strongest teams. Talent is my #1 priority, and I am grateful for our employees who could work anywhere but chose to be a part of Rula. Thank you for considering joining our team!
                 </p>
                 
                 <div style={{ 
                   fontFamily: "cursive, serif", 
                   fontSize: "1.5rem", 
                   fontWeight: "600", 
                   color: "#1a1a1a",
                   marginTop: "2rem"
                 }}>
                   Josh Bruno
                 </div>
               </div>
               
               {/* Right Column - CEO Photo */}
               <div style={{ 
                 display: "flex", 
                 justifyContent: "center", 
                 alignItems: "center"
               }}>
                 <div style={{ 
                   width: "300px", 
                   height: "400px", 
                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                   borderRadius: "12px",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   color: "#fff",
                   fontSize: "4rem",
                   position: "relative",
                   overflow: "hidden"
                 }}>
                   <div style={{ 
                     position: "absolute",
                     top: "50%",
                     left: "50%",
                     transform: "translate(-50%, -50%)",
                     textAlign: "center"
                   }}>
                     👨‍💼
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* Our Values Section */}
         <div style={{ 
           width: "100%", 
           background: "#fff", 
           padding: "4rem 0",
           marginTop: "2rem"
         }}>
           <div style={{ 
             maxWidth: "1200px", 
             margin: "0 auto", 
             display: "grid", 
             gridTemplateColumns: "1fr 1fr", 
             gap: "4rem", 
             alignItems: "center",
             padding: "0 2rem"
           }}>
             {/* Left Column - Visual Panel */}
             <div style={{ 
               background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
               borderRadius: "12px 12px 0 0",
               padding: "3rem 2rem",
               textAlign: "center",
               position: "relative",
               minHeight: "400px",
               display: "flex",
               flexDirection: "column",
               justifyContent: "space-between"
             }}>
               {/* Logo */}
               <div style={{ 
                 width: "60px", 
                 height: "60px", 
                 background: "linear-gradient(135deg, #00695c 0%, #004d40 100%)",
                 borderRadius: "50%",
                 margin: "0 auto 2rem",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 fontSize: "1.5rem",
                 color: "#fff",
                 fontWeight: "bold"
               }}>
                 ∞
               </div>
               
               {/* Text */}
               <div style={{ 
                 color: "#00695c", 
                 fontSize: "1.5rem", 
                 fontWeight: "600",
                 lineHeight: "1.3",
                 marginBottom: "2rem"
               }}>
                 We can make real<br />progress together
               </div>
               
               {/* Chart Visualization */}
               <div style={{ 
                 display: "flex", 
                 alignItems: "end", 
                 justifyContent: "center", 
                 gap: "8px",
                 height: "120px"
               }}>
                 <div style={{ width: "8px", height: "40px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "8px", height: "60px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "8px", height: "30px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "8px", height: "80px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "12px", height: "100px", background: "#00695c", borderRadius: "6px", position: "relative" }}>
                   <div style={{ 
                     position: "absolute", 
                     top: "-8px", 
                     left: "50%", 
                     transform: "translateX(-50%)", 
                     width: "16px", 
                     height: "16px", 
                     background: "#00695c", 
                     borderRadius: "50%" 
                   }}></div>
                 </div>
                 <div style={{ width: "8px", height: "50px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "8px", height: "70px", background: "#b2ebf2", borderRadius: "4px" }}></div>
                 <div style={{ width: "8px", height: "45px", background: "#b2ebf2", borderRadius: "4px" }}></div>
               </div>
             </div>
             
             {/* Right Column - Values List */}
             <div>
               <h2 style={{ 
                 fontSize: "2.5rem", 
                 fontWeight: 700, 
                 color: "#1a1a1a", 
                 marginBottom: "2rem"
               }}>
                 Our values
               </h2>
               
               <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Bias to Action
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Nobody else is more capable of solving this problem than you are right now.
                   </p>
                 </div>
                 
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Self-care
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Put your life jacket on before helping others.
                   </p>
                 </div>
                 
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Authenticity
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Be yourself and be open to others.
                   </p>
                 </div>
                 
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Camaraderie
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Take care of one another.
                   </p>
                 </div>
                 
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Transparency
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Be honest even if it's uncomfortable.
                   </p>
                 </div>
                 
                 <div>
                   <h3 style={{ 
                     fontSize: "1.2rem", 
                     fontWeight: "600", 
                     color: "#1a1a1a", 
                     marginBottom: "0.5rem"
                   }}>
                     Operational Rigor
                   </h3>
                   <p style={{ 
                     fontSize: "1rem", 
                     color: "#666", 
                     lineHeight: "1.6"
                   }}>
                     Maintain high standards in everything we do.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         <div 
           id="openings"
           style={{ 
             background: "#f8f9fa", 
             borderRadius: "20px", 
             padding: "40px", 
             maxWidth: "800px", 
             width: "90%",
             marginTop: "2rem"
           }}
         >
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.5rem", textAlign: "center" }}>
            Current Openings
          </h2>
          
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ 
              background: "#fff", 
              borderRadius: "12px", 
              padding: "24px", 
              border: "1px solid #e1e5e9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "8px" }}>
                Licensed Clinical Psychologist
              </h3>
              <p style={{ color: "#666", marginBottom: "12px" }}>
                Full-time • Remote • Competitive salary
              </p>
              <p style={{ color: "#444", lineHeight: "1.6" }}>
                We're looking for experienced clinical psychologists to join our team and provide high-quality mental health care to our clients.
              </p>
              <button style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "12px",
                transition: "background 0.2s"
              }}>
                Apply Now
              </button>
            </div>
            
            <div style={{ 
              background: "#fff", 
              borderRadius: "12px", 
              padding: "24px", 
              border: "1px solid #e1e5e9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "8px" }}>
                Frontend Developer
              </h3>
              <p style={{ color: "#666", marginBottom: "12px" }}>
                Full-time • Remote • Competitive salary
              </p>
              <p style={{ color: "#444", lineHeight: "1.6" }}>
                Help us build and improve our platform to make mental health care more accessible and user-friendly.
              </p>
              <button style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "12px",
                transition: "background 0.2s"
              }}>
                Apply Now
              </button>
            </div>
            
            <div style={{ 
              background: "#fff", 
              borderRadius: "12px", 
              padding: "24px", 
              border: "1px solid #e1e5e9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "8px" }}>
                Customer Success Manager
              </h3>
              <p style={{ color: "#666", marginBottom: "12px" }}>
                Full-time • Remote • Competitive salary
              </p>
              <p style={{ color: "#444", lineHeight: "1.6" }}>
                Help our clients get the most out of our platform and ensure they have a positive experience with our services.
              </p>
              <button style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "12px",
                transition: "background 0.2s"
              }}>
                Apply Now
              </button>
            </div>
          </div>
          
          <div style={{ 
            textAlign: "center", 
            marginTop: "40px", 
            padding: "30px",
            background: "rgba(39,174,96,0.05)",
            borderRadius: "12px"
          }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#1a1a1a", marginBottom: "12px" }}>
              Don't see a role that fits?
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button style={{
              background: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s"
            }}>
              Send Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
