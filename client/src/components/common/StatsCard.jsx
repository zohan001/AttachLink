import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value ?? "—"}</p>
        </div>
        {Icon && (
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}15`, color }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
