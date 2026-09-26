import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const createHeuristicReport = (completedAnswers) => {
  const validAnswers = completedAnswers.filter((item) => {
    const answer = (item.userAnswer || '').trim();
    return answer.length > 25 && !/^(asdf|qwer|test|hello|hi|ok|yes|no)$/i.test(answer);
  }).length;

  const baseScore = Math.min(100, Math.max(12, Math.round((validAnswers / Math.max(1, completedAnswers.length)) * 100)));

  return {
    score: baseScore,
    confidenceLevel: baseScore >= 80 ? 'Intermediate' : baseScore >= 50 ? 'Needs Practice' : 'Beginner',
    strengths: validAnswers > 0 ? 'Candidate provided structured technical responses with relevant domain keywords.' : 'No meaningful technical content detected.',
    areasOfImprovement: validAnswers > 0
      ? 'Give more concrete examples, technical depth, and exact trade-offs to improve your evaluation score.'
      : 'Write detailed, relevant answers with real examples and technical reasoning.'
  };
};

const requestAiEvaluation = async (domainTitle, completedAnswers) => {
  const response = await fetch('http://localhost:5000/api/ai/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domainTitle,
      answers: completedAnswers
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'AI evaluation failed.');
  }

  return data.report || createHeuristicReport(completedAnswers);
};

export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const domainTitle = location.state?.domain || 'Full-Stack Engineering';
  
  const storedUser = JSON.parse(localStorage.getItem('ai_user')) || {};
  const isProUser = location.state?.isPro || storedUser.isPro || false; 

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answersList, setAnswersList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  const questionBank = {
    'Full-Stack Engineering': [
      { q: "Explain the core architecture of Full-Stack apps and how state flows between client and server.", tier: 'Free' },
      { q: "What are common performance bottlenecks in Node.js/Express APIs, and how do you fix them?", tier: 'Free' },
      { q: "Explain the difference between SQL indexing and database normalization techniques.", tier: 'Free' },
      { q: "How do you implement secure JWT authentication and HttpOnly cookie security?", tier: 'Free' },
      { q: "What is Server-Side Rendering (SSR) vs Client-Side Rendering (CSR) trade-offs?", tier: 'Free' },
      { q: "Describe a complex database sharding and master-slave replication strategy you designed.", tier: 'Pro' },
      { q: "How do you handle real-time bi-directional event streaming using WebSockets at scale?", tier: 'Pro' },
      { q: "Explain microservices inter-service communication using gRPC and Kafka event brokers.", tier: 'Pro' },
      { q: "How do you perform zero-downtime database migrations on large production tables?", tier: 'Pro' },
      { q: "Write a strategy for caching distributed sessions using Redis cluster and eviction policies.", tier: 'Pro' }
    ],
    'Data Structures & Algorithms': [
      { q: "Explain BFS and DFS graph traversal algorithms with time complexities.", tier: 'Free' },
      { q: "When would you prefer a Hash Map over a Binary Search Tree?", tier: 'Free' },
      { q: "Explain how QuickSort and MergeSort partition data and their worst-case scenarios.", tier: 'Free' },
      { q: "What is memoization in Dynamic Programming? Give an example.", tier: 'Free' },
      { q: "Explain Dijkstra's shortest path algorithm and its limitations with negative weights.", tier: 'Free' },
      { q: "Solve the Traveling Salesperson Problem using bitmasking and dynamic programming.", tier: 'Pro' },
      { q: "Explain Red-Black trees and self-balancing rotation mechanics.", tier: 'Pro' },
      { q: "Implement an LRU Cache with O(1) time complexity for get and put operations.", tier: 'Pro' },
      { q: "Explain Segment Trees or Fenwick Trees for range query updates.", tier: 'Pro' },
      { q: "How do you detect cycles in directed and undirected graphs using Tarjan's algorithm?", tier: 'Pro' }
    ],
    'AI & Generative AI Roles': [
      { q: "Explain RAG (Retrieval-Augmented Generation) architecture and vector embeddings.", tier: 'Free' },
      { q: "How do you handle token limits and context window optimization in LLMs?", tier: 'Free' },
      { q: "What is the difference between zero-shot, few-shot, and fine-tuning prompts?", tier: 'Free' },
      { q: "Explain cosine similarity in vector databases like Pinecone or Chroma.", tier: 'Free' },
      { q: "What are hallucinations in LLMs, and how do you mitigate them?", tier: 'Free' },
      { q: "Describe how you fine-tune an open-source LLM using LoRA and QLoRA parameters.", tier: 'Pro' },
      { q: "Explain Transformer attention mechanisms and Multi-Head Attention equations.", tier: 'Pro' },
      { q: "How do you architect a multi-agent autonomous workflow using LangGraph or AutoGen?", tier: 'Pro' },
      { q: "Optimize GPU memory utilization using vLLM and PagedAttention during inference.", tier: 'Pro' },
      { q: "Design a hybrid search pipeline combining BM25 keyword search with dense vector retrieval.", tier: 'Pro' }
    ],
    'DevOps & Cloud Engineering': [
      { q: "Explain CI/CD pipelines and core automation steps using GitHub Actions.", tier: 'Free' },
      { q: "What is the difference between Docker containers and virtual machines?", tier: 'Free' },
      { q: "Explain basic Linux file permissions and process management commands.", tier: 'Free' },
      { q: "What is Infrastructure as Code (IaC) using Terraform?", tier: 'Free' },
      { q: "How do load balancers distribute incoming web traffic across multiple servers?", tier: 'Free' },
      { q: "Design a zero-downtime rolling deployment architecture on Kubernetes (EKS).", tier: 'Pro' },
      { q: "Explain service mesh architecture using Istio for traffic management and mTLS.", tier: 'Pro' },
      { q: "How do you configure multi-region disaster recovery failover on AWS?", tier: 'Pro' },
      { q: "Implement custom Prometheus metrics and Grafana alerting for pod memory leaks.", tier: 'Pro' },
      { q: "Describe advanced GitOps workflows using ArgoCD and Kubernetes operators.", tier: 'Pro' }
    ],
    'Cyber Security & Ethical Hacking': [
      { q: "Explain the OWASP Top 10 vulnerabilities, focusing on SQL Injection and XSS.", tier: 'Free' },
      { q: "What is the difference between symmetric and asymmetric encryption?", tier: 'Free' },
      { q: "Explain how HTTPS and SSL/TLS handshakes establish secure sessions.", tier: 'Free' },
      { q: "What is multi-factor authentication (MFA) and why is it crucial?", tier: 'Free' },
      { q: "How do firewalls and Intrusion Detection Systems (IDS) protect networks?", tier: 'Free' },
      { q: "Describe your complete methodology for a black-box web app penetration test.", tier: 'Pro' },
      { q: "How do buffer overflow attacks work, and what are stack canary protections?", tier: 'Pro' },
      { q: "Explain OAuth 2.0 and OpenID Connect token flows with security pitfalls.", tier: 'Pro' },
      { q: "Perform root-cause analysis on a sophisticated ransomware lateral movement attack.", tier: 'Pro' },
      { q: "How do you implement Zero Trust Network Architecture (ZTNA) in enterprise setups?", tier: 'Pro' }
    ],
    'Data Science & Analytics': [
      { q: "Explain L1 (Lasso) and L2 (Ridge) regularization in machine learning.", tier: 'Free' },
      { q: "How do you handle missing values and outlier detection in datasets?", tier: 'Free' },
      { q: "What is the difference between classification and regression algorithms?", tier: 'Free' },
      { q: "Explain precision, recall, F1-score, and ROC-AUC curves.", tier: 'Free' },
      { q: "How do you perform A/B testing and calculate statistical significance (p-value)?", tier: 'Free' },
      { q: "Describe how you deploy and monitor ML models in production using MLflow.", tier: 'Pro' },
      { q: "Explain Gradient Boosting mechanics in XGBoost and LightGBM.", tier: 'Pro' },
      { q: "How do you handle severe class imbalance using SMOTE and cost-sensitive learning?", tier: 'Pro' },
      { q: "Design a recommendation engine using collaborative filtering and matrix factorization.", tier: 'Pro' },
      { q: "Explain Time Series forecasting models like ARIMA, Prophet, and Transformers.", tier: 'Pro' }
    ],
    'Mobile App Development': [
      { q: "Explain the widget lifecycle in Flutter or component lifecycle in React Native.", tier: 'Free' },
      { q: "How do you manage local persistent storage securely on mobile devices?", tier: 'Free' },
      { q: "What is the difference between native, hybrid, and cross-platform mobile apps?", tier: 'Free' },
      { q: "How do you handle responsive layouts across different mobile screen sizes?", tier: 'Free' },
      { q: "Explain mobile app state management patterns (Provider, Redux, Bloc).", tier: 'Free' },
      { q: "Optimize native bridge communication and memory leaks in cross-platform apps.", tier: 'Pro' },
      { q: "Implement offline-first data synchronization using SQLite and WatermelonDB.", tier: 'Pro' },
      { q: "How do you configure push notifications using Firebase Cloud Messaging (FCM)?", tier: 'Pro' },
      { q: "Profile CPU and memory performance using Android Studio Profiler / Xcode Instruments.", tier: 'Pro' },
      { q: "Setup automated CI/CD pipelines for publishing to Google Play and Apple App Store.", tier: 'Pro' }
    ],
    'UI/UX Product Design': [
      { q: "What is your UI/UX design thinking process from wireframes to high-fi prototypes?", tier: 'Free' },
      { q: "How do you conduct user research and usability testing for new features?", tier: 'Free' },
      { q: "Explain WCAG accessibility guidelines and color contrast ratios.", tier: 'Free' },
      { q: "What are atomic design principles in modern interface creation?", tier: 'Free' },
      { q: "How do you handle responsive layout design for mobile and desktop screens?", tier: 'Free' },
      { q: "Explain how you build and scale a multi-brand design system in Figma.", tier: 'Pro' },
      { q: "Conduct a complex heuristic evaluation and cognitive walkthrough for an enterprise app.", tier: 'Pro' },
      { q: "How do you transition complex user data flows into intuitive micro-interactions?", tier: 'Pro' },
      { q: "Measure UX ROI and product metrics using conversion funnels and retention cohorts.", tier: 'Pro' },
      { q: "Design cross-platform design tokens for seamless developer handoff via Tokens Studio.", tier: 'Pro' }
    ]
  };

  const domainQuestions = questionBank[domainTitle] || questionBank['Full-Stack Engineering'];
  const questions = isProUser ? domainQuestions : domainQuestions.slice(0, 5);

  const evaluateWithGroq = async (completedAnswers) => {
    setIsEvaluating(true);
    try {
      const parsedData = await requestAiEvaluation(domainTitle, completedAnswers);
      setAiReport(parsedData);
    } catch (error) {
      console.error('Groq AI Evaluation Error:', error);
      setAiReport(createHeuristicReport(completedAnswers));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    const updatedAnswers = [...answersList, { question: currentQ.q, userAnswer: answer }];
    setAnswersList(updatedAnswers);
    setAnswer('');

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(120);
    } else {
      setIsFinished(true);
      evaluateWithGroq(updatedAnswers);
    }
  };

  useEffect(() => {
    if (isFinished) return;
    
    if (timeLeft <= 0) {
      const timeoutId = setTimeout(() => {
        handleNextQuestion();
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#fff', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden', paddingBottom: '40px' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '-100px', left: '20%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.1)', filter: 'blur(130px)', borderRadius: '50%', zIndex: 0 }}></div>

      {/* Top Bar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          ⚡ Groq AI Hub : {domainTitle} {isProUser ? '✨ [PRO ELITE]' : '[FREE TIER]'}
        </h2>
        {!isFinished && (
          <div style={{ background: timeLeft <= 30 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.1)', border: timeLeft <= 30 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 14px', borderRadius: '10px', color: timeLeft <= 30 ? '#ef4444' : '#38bdf8', fontWeight: '700', fontSize: '14px' }}>
            ⏳ Time Left: {formatTime(timeLeft)}
          </div>
        )}
      </nav>

      {/* Main Room Container */}
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {!isFinished ? (
          <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '40px', borderRadius: '24px', backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span style={{ background: questions[currentQuestionIndex].tier === 'Pro' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: questions[currentQuestionIndex].tier === 'Pro' ? '#a855f7' : '#10b981', padding: '2px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', border: questions[currentQuestionIndex].tier === 'Pro' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)' }}>
                  {questions[currentQuestionIndex].tier} Tier
                </span>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Groq Neural Engine Active ⚡</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <p style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.6', color: '#f8fafc', margin: 0 }}>
                {questions[currentQuestionIndex].q}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>
                Your Answer / Explanation (2 minutes allocated):
              </label>
              <textarea 
                rows="7"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your structured technical answer here..."
                style={{ width: '100%', padding: '16px', background: '#030712', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '14px', color: '#fff', fontSize: '15px', outline: 'none', resize: 'none', lineHeight: '1.6', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              onClick={handleNextQuestion}
              style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#fff', border: 'none', padding: '15px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(37,99,235,0.4)', transition: '0.3s' }}>
              {currentQuestionIndex + 1 === questions.length ? 'Finish & Analyze with Groq AI 🚀' : 'Next Question →'}
            </button>

          </div>
        ) : (
          <div style={{ background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '40px', borderRadius: '24px', textAlign: 'center', backdropFilter: 'blur(16px)' }}>
            
            {isEvaluating ? (
              <div>
                <div style={{ fontSize: '40px', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⚙️</div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>Groq AI is strictly evaluating your answers...</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Checking technical accuracy and depth of explanations via Llama models.</p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                <h1 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '10px', color: '#f8fafc' }}>Mock Interview Evaluated!</h1>
                <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '30px' }}>
                  Groq neural diagnostic engine has successfully scored your performance out of 100.
                </p>

                {/* Score Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px', textAlign: 'left' }}>
                  <div style={{ background: '#030712', padding: '20px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 6px 0' }}>Overall Score / Ranking</p>
                    <h3 style={{ color: '#38bdf8', fontSize: '32px', fontWeight: '900', margin: 0 }}>{aiReport?.score ?? 0} <span style={{ fontSize: '16px', color: '#64748b' }}>/ 100</span></h3>
                  </div>
                  <div style={{ background: '#030712', padding: '20px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 6px 0' }}>Proficiency Level</p>
                    <h3 style={{ color: '#10b981', fontSize: '22px', fontWeight: '900', margin: 0 }}>{aiReport?.confidenceLevel || 'Beginner'}</h3>
                  </div>
                </div>

                {/* Feedback Box */}
                <div style={{ background: '#030712', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: '30px' }}>
                  <p style={{ color: '#38bdf8', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>💡 AI Strengths Feedback:</p>
                  <p style={{ color: '#f8fafc', fontSize: '14px', marginBottom: '14px', lineHeight: '1.5' }}>{aiReport?.strengths}</p>
                  
                  <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>⚠️ Areas of Improvement:</p>
                  <p style={{ color: '#f8fafc', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{aiReport?.areasOfImprovement}</p>
                </div>

                {/* PRO UPSELL PAYWALL */}
                {!isProUser && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '24px', borderRadius: '16px', marginBottom: '30px', textAlign: 'center' }}>
                    <h3 style={{ color: '#c084fc', fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>🔒 Unlock 10 Pro Questions & Deep Code Analysis at Just ₹99/month!</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '16px', maxWidth: '500px', margin: '0 auto 16px auto' }}>
                      Free tier evaluates only 5 basic questions. Upgrade to **Pro Elite** to unlock system design simulations, advanced ranking, and priority Groq AI feedback.
                    </p>
                    <button 
                      onClick={() => navigate('/payment')}
                      style={{ background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(147,51,234,0.4)' }}>
                      ⚡ Upgrade to Pro Elite (Plans starting ₹89)
                    </button>
                  </div>
                )}

                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}>
                  Return to Dashboard 🏠
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}