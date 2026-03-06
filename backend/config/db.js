import supabase from "../config/supabase.js";

async function initDatabase() {
  try {
    console.log("🔄 Checking database connection...");

    // timeout after 10 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database check timeout after 10s")), 10000)
    );

    const queryPromise = supabase
      .from("Company")
      .select("*", { count: "exact", head: true });

    const { error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.warn("⚠️ Database connection warning:", error.message);
      console.log("Status:", error.status);
      console.log("Code:", error.code);
    } else {
      console.log("✅ Database connected successfully");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    console.error("Type:", error.constructor.name);
    console.error("Stack:", error.stack);
  }
}

export default initDatabase;