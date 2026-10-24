import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Copy, 
  Check,
  Loader2,
  Sparkles,
  Brain,
  Trash2,
  Settings,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { useStudy } from '../context/StudyContext';
import { useToast } from '../hooks/useToast';
import { cn } from '../lib/utils';

const samplePrompts = [
  'Explain photosynthesis in simple terms',
  'Create a study plan for calculus',
  'Generate 10 flashcards for biology',
  'Quiz me on world history',
  'How do I improve my memory?',
  'Summarize the French Revolution',
];

const mockResponses = {
  'photosynthesis': 'Photosynthesis is how plants make their own food! 🌱\n\n**The Simple Version:**\nPlants take in sunlight using their leaves, absorb carbon dioxide from the air, and drink water through their roots. Using the sun\'s energy, they combine CO₂ and H₂O to create glucose (sugar) and release oxygen.\n\n**The Equation:**\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\n**Key Stages:**\n1. **Light-dependent reactions** - Capture light energy, split water, produce ATP & NADPH\n2. **Calvin Cycle** - Use ATP & NADPH to fix CO₂ into glucose\n\nWant me to create flashcards or a quiz on this topic?',
  'study plan': 'Here\'s a personalized 4-week study plan for Calculus:\n\n**Week 1: Foundations**\n- Limits & Continuity (Days 1-3)\n- Derivative Definition (Days 4-5)\n- Practice Problems (Days 6-7)\n\n**Week 2: Differentiation Rules**\n- Power, Product, Quotient Rules\n- Chain Rule\n- Implicit Differentiation\n\n**Week 3: Applications**\n- Related Rates\n- Optimization\n- Curve Sketching\n\n**Week 4: Integration**\n- Antiderivatives\n- Fundamental Theorem\n- Techniques of Integration\n\n**Daily Schedule:** 1.5-2 hours/day with 10-min breaks every 45 mins\n\nWould you like me to adjust this plan or create flashcards for any specific topic?',
  'flashcards': 'I\'ll create 10 biology flashcards for you!\n\n1. **Q:** What is the powerhouse of the cell?\n   **A:** Mitochondria\n\n2. **Q:** What does DNA stand for?\n   **A:** Deoxyribonucleic Acid\n\n3. **Q:** What is osmosis?\n   **A:** Movement of water across a semipermeable membrane from low to high solute concentration\n\n4. **Q:** What are the 4 bases in DNA?\n   **A:** Adenine, Thymine, Guanine, Cytosine\n\n5. **Q:** What is mitosis?\n   **A:** Cell division producing two identical daughter cells\n\n6. **Q:** What is the function of ribosomes?\n   **A:** Protein synthesis\n\n7. **Q:** What is a gene?\n   **A:** A segment of DNA that codes for a protein\n\n8. **Q:** What is photosynthesis?\n   **A:** Process plants use to convert light energy into chemical energy\n\n9. **Q:** What are enzymes?\n   **A:** Biological catalysts that speed up chemical reactions\n\n10. **Q:** What is homeostasis?\n    **A:** Maintenance of stable internal conditions\n\nWant me to save these as flashcards or create a quiz from them?',
  'quiz': 'Here\'s a quick World History quiz! 🌍\n\n**Question 1:** What year did World War I begin?\nA) 1914  B) 1918  C) 1939  D) 1945\n\n**Question 2:** Who was the first Emperor of Rome?\nA) Julius Caesar  B) Augustus  C) Nero  D) Constantine\n\n**Question 3:** The Renaissance began in which country?\nA) France  B) Germany  C) Italy  D) England\n\n**Question 4:** What was the Silk Road?\nA) A trade route  B) A Chinese dynasty  C) A type of fabric  D) A military road\n\n**Question 5:** Which revolution happened first?\nA) French Revolution  B) American Revolution  C) Russian Revolution  D) Industrial Revolution\n\n**Answers:** 1-A, 2-B, 3-C, 4-A, 5-B\n\nScore: 5/5 = History Expert! 🏆\n\nWant more questions or a different topic?',
  'memory': 'Here are science-backed memory techniques:\n\n**1. Spaced Repetition** ⏰\nReview at increasing intervals: 1 day → 3 days → 1 week → 2 weeks → 1 month\n\n**2. Active Recall** 🧠\nTest yourself instead of re-reading. Close the book and explain concepts aloud.\n\n**3. Feynman Technique** 📝\nExplain it simply as if teaching a 5-year-old. Identify gaps in understanding.\n\n**4. Chunking** 📦\nBreak large info into small meaningful groups (e.g., phone numbers: 555-0199)\n\n**5. Mind Palaces** 🏰\nAssociate info with familiar locations (Method of Loci)\n\n**6. Dual Coding** 🎨\nCombine words with visuals - draw diagrams, mind maps, sketches\n\n**7. Interleaving** 🔄\nMix different topics in one session rather than blocking\n\n**8. Sleep & Exercise** 😴💪\nConsolidates memories during sleep; exercise boosts BDNF\n\n**Pro Tip:** Use our Flashcards feature - it automatically schedules reviews using spaced repetition!',
  'french revolution': 'The French Revolution (1789-1799) was a pivotal period in world history.\n\n**Causes:**\n- Financial crisis from wars & royal spending\n- Social inequality (Three Estates system)\n- Enlightenment ideas (liberty, equality)\n- Poor harvests & food shortages\n\n**Key Phases:**\n1. **Moderate Phase (1789-1792)**\n   - Estates-General → National Assembly\n   - Storming of the Bastille (July 14, 1789)\n   - Declaration of Rights of Man\n\n2. **Radical Phase (1792-1794)**\n   - Monarchy abolished, Republic declared\n   - Reign of Terror (Robespierre)\n   - ~17,000 executed\n\n3. **Directory Phase (1795-1799)**\n   - More moderate government\n   - Ended with Napoleon\'s coup\n\n**Legacy:**\n- End of feudalism in Europe\n- Spread of nationalism & democracy\n- Inspired future revolutions\n\nWant a quiz or flashcards on this topic?',
};

function getMockResponse(message) {
  const lower = message.toLowerCase();
  
  if (lower.includes('photosynthesis')) return mockResponses.photosynthesis;
  if (lower.includes('study plan') || lower.includes('calculus')) return mockResponses['study plan'];
  if (lower.includes('flashcard') && lower.includes('biology')) return mockResponses.flashcards;
  if (lower.includes('quiz') && lower.includes('history')) return mockResponses.quiz;
  if (lower.includes('memory') || lower.includes('remember')) return mockResponses.memory;
  if (lower.includes('french revolution')) return mockResponses['french revolution'];
  
  // Default response
  return `Great question! 🤔 As your AI tutor, I can help you with:

• **Explain concepts** - "Explain quantum physics simply"
• **Create study materials** - "Make flashcards for chemistry"
• **Generate quizzes** - "Quiz me on American history"
• **Build study plans** - "Plan for learning Spanish in 3 months"
• **Study tips** - "How to memorize faster?"

What would you like help with today? You can also try one of the suggested prompts below!`;
}

export function AITutor() {
  const { addChatMessage, chatHistory, clearChatHistory } = useStudy();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowPrompts(false);
    setIsLoading(true);

    // Add user message
    addChatMessage({ role: 'user', content: userMessage });

    // Simulate AI response
    setTimeout(() => {
      const response = getMockResponse(userMessage);
      addChatMessage({ role: 'assistant', content: response });
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
    handleSend({ preventDefault: () => {} });
  };

  const handleClearChat = () => {
    clearChatHistory();
    setMessages([]);
    setShowPrompts(true);
    toast.success('Chat cleared');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="pt-16 h-[calc(100vh-4rem)] flex flex-col">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Tutor</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your personal study assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearChat} disabled={messages.length === 0}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.length === 0 && showPrompts && (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help you study?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Ask me anything - explain concepts, create flashcards, generate quizzes, build study plans, and more!
              </p>
              <div className="grid sm:grid-cols-2 gap-3 w-full max-w-md">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-sm"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={cn('flex gap-3 animate-fade-in', message.role === 'user' && 'flex-row-reverse')}>
              <Avatar
                name={message.role === 'user' ? 'You' : 'AI'}
                size="sm"
                fallbackColor={message.role === 'user' ? 'bg-primary-500' : 'bg-accent-500'}
              />
              <div className={cn('flex-1 max-w-[85%]', message.role === 'user' ? 'text-right' : '')}>
                <div className={cn(
                  'inline-block px-4 py-3 rounded-2xl',
                  message.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm'
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="whitespace-pre-wrap">{line}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100">
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => copyToClipboard(message.content)}
                      className="text-xs"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar name="AI" size="sm" fallbackColor="bg-accent-500" />
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-6">
          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[50px] max-h-40"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                isLoading={isLoading}
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="AI Tutor Settings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Personality</h4>
            <div className="space-y-2">
              {['Helpful & Encouraging', 'Concise & Direct', 'Detailed & Thorough', 'Socratic Method'].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input type="radio" name="personality" className="text-primary-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Response Length</h4>
            <div className="flex gap-2">
              {['Short', 'Medium', 'Long'].map((option) => (
                <Button key={option} variant="outline" className="flex-1" size="sm">
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleClearChat}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat History
          </Button>
        </div>
      </Modal>
    </div>
  );
}