import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  GripVertical
} from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import API from "../services/api";

const stepOptions = [
  { label: "Clean Text", value: "clean_text", desc: "Removes noise & formatting", color: "from-blue-500 to-cyan-400" },
  { label: "Summarize", value: "summarize", desc: "Shortens long content", color: "from-purple-500 to-pink-400" },
  { label: "Extract Key Points", value: "extract_key_points", desc: "Finds important data", color: "from-orange-500 to-yellow-400" },
  { label: "Tag Category", value: "tag_category", desc: "Auto-labels content", color: "from-emerald-500 to-teal-400" },
];

export default function WorkflowForm() {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const addStep = (step) => {
    if (steps.length >= 4) {
      triggerMessage("Maximum 4 steps allowed!", "error");
      return;
    }
    const uniqueId = `${step.value}-${Date.now()}`;
    setSteps([...steps, { ...step, id: uniqueId }]);
  };

  const removeStep = (id) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const triggerMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSubmit = async () => {
    if (!name || steps.length < 2) {
      triggerMessage("Give it a name and at least 2 steps!", "error");
      return;
    }

    try {
      setLoading(true);
      await API.post("/workflows", {
        name,
        steps: steps.map((s) => ({ type: s.value })),
      });
      triggerMessage("Workflow deployed to the cloud! 🚀", "success");
      setName("");
      setSteps([]);
    } catch (error) {
      triggerMessage("Deployment failed. Check connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      
      {/* --- Header Section --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles size={14} className="mr-2" /> AI Orchestrator
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          BUILD PIPELINE
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Chain together powerful AI models to create custom automation workflows in seconds.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- Left: Configuration --- */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
              Workflow Identity
            </label>
            <div className="group relative">
              <Input
                placeholder="e.g. Content Transformer Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 focus:border-indigo-500 h-14 text-lg transition-all"
              />
              <div className="absolute inset-0 rounded-xl bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all -z-10" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <label className="text-xs font-bold uppercase tracking-widest text-purple-400 block">
              Available Modules
            </label>
            <div className="grid grid-cols-1 gap-3">
              {stepOptions.map((step) => (
                <motion.button
                  key={step.value}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addStep(step)}
                  className="flex items-start p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className={`mt-1 w-2 h-2 rounded-full bg-gradient-to-r ${step.color} mr-4 group-hover:animate-pulse`} />
                  <div>
                    <p className="font-bold text-gray-200">{step.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                  <Plus size={18} className="ml-auto text-gray-600 group-hover:text-white transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- Right: Visual Builder --- */}
        <div className="lg:col-span-7">
          <Card className="relative min-h-[500px] bg-black/40 border-white/5 backdrop-blur-sm flex flex-col items-center py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] pointer-events-none" />
            
            <AnimatePresence mode="popLayout">
              {steps.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center">
                    <ArrowDown className="animate-bounce" />
                  </div>
                  <p className="font-mono text-sm uppercase tracking-tighter text-center">
                    Pipeline Empty<br/>Select modules to start
                  </p>
                </motion.div>
              ) : (
                <Reorder.Group 
                  axis="y" 
                  values={steps} 
                  onReorder={setSteps} 
                  className="w-full max-w-sm space-y-4 relative z-10"
                >
                  {steps.map((step, index) => (
                    <Reorder.Item
                      key={step.id}
                      value={step}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, x: 50 }}
                      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                      className="relative group"
                    >
                      {/* Connector Line */}
                      {index !== steps.length - 1 && (
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-gradient-to-b from-indigo-500 to-transparent z-0" />
                      )}

                      <div className="relative z-10 flex items-center bg-white/[0.07] border border-white/10 p-4 rounded-2xl backdrop-blur-xl group-hover:border-indigo-500/50 transition-all shadow-xl">
                        <div className="cursor-grab active:cursor-grabbing mr-4 text-gray-600 hover:text-white">
                          <GripVertical size={20} />
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mr-4`}>
                          {index + 1}
                        </div>
                        <span className="font-bold text-gray-200">{step.label}</span>
                        <button 
                          onClick={() => removeStep(step.id)}
                          className="ml-auto p-2 text-gray-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </AnimatePresence>

            {/* --- Action Buttons --- */}
            <motion.div 
              layout
              className="mt-auto w-full max-w-sm pt-10"
            >
              <Button 
                onClick={handleSubmit} 
                loading={loading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3"
              >
                {loading ? "Deploying..." : (
                  <> <CheckCircle2 size={20} /> Save & Deploy </>
                )}
              </Button>

              <AnimatePresence>
                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${
                      message.type === "success" ? "text-emerald-400" : "text-rose-400 underline decoration-rose-500/30"
                    }`}
                  >
                    {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Card>
        </div>
      </div>
    </div>
  );
}