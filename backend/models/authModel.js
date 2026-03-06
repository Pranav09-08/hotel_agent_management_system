import supabase from "../config/supabase.js";

// Find user by email in admin table
export const findAdminByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No user found
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding admin:", error);
    throw error;
  }
};

// Find user by email in sales_manager table
export const findSalesManagerByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from("sales_manager")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No user found
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding sales manager:", error);
    throw error;
  }
};

// Unified function to find user in both tables
export const findUserByEmail = async (email) => {
  // First check admin table
  const admin = await findAdminByEmail(email);
  if (admin) {
    return { user: admin, userType: "admin" };
  }

  // Then check sales_manager table
  const salesManager = await findSalesManagerByEmail(email);
  if (salesManager) {
    return { user: salesManager, userType: "sales_manager" };
  }

  return null;
};
