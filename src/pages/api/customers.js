import { IncomingForm } from "formidable";
import fs from "fs";
import { supabase } from "../../../utils/supabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { method, query } = req;

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  switch (method) {
    case "GET":
      try {
        const { id, nationality, startDate, endDate, search } = query;
        let filterQuery = supabase.from("customers").select("*");

        if (id) {
          filterQuery = filterQuery.eq("id", id).single();
        }
        if (nationality) {
          filterQuery = filterQuery.eq("nationality", nationality);
        }
        if (startDate && endDate) {
          filterQuery = filterQuery
            .gte("created_at", startDate)
            .lte("created_at", endDate);
        }
        if (search) {
          filterQuery = filterQuery.or(
            `name.ilike.%${search}%,email.ilike.%${search}%`
          );
        }
        const { data: customers, error: getError } = await filterQuery;
        if (getError) throw getError;
        res.status(200).json(customers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case "POST":
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          res.status(500).json({ error: "Error parsing form data" });
          return;
        }

        try {
          const name = fields.name?.[0] || "";
          const email = fields.email?.[0] || "";
          const phone = fields.phone?.[0] || "";
          const address = fields.address?.[0] || "";
          const dob = fields.dob?.[0] || "";
          const nationality = fields.nationality?.[0] || "";
          const country = fields.country?.[0] || "";

          if (!name || !email || !phone) {
            res
              .status(400)
              .json({ error: "Name, email, and phone are required fields" });
            return;
          }

          const today = new Date().toISOString().split("T")[0];
          if (dob && dob > today) {
            res
              .status(400)
              .json({ error: "Date of birth cannot be in the future" });
            return;
          }

          let photoUrl = null;

          if (files.photo && Array.isArray(files.photo)) {
            const file = files.photo[0];
            if (file && file.filepath) {
              try {
                const fileData = fs.readFileSync(file.filepath);
                const filePath = `public/${name}_${Date.now()}_${
                  file.originalFilename
                }`;

                const { error: uploadError } = await supabase.storage
                  .from("customer-photos")
                  .upload(filePath, fileData, { contentType: file.mimetype });

                if (uploadError) throw uploadError;

                const { data: publicURLData } = await supabase.storage
                  .from("customer-photos")
                  .getPublicUrl(filePath);

                photoUrl = publicURLData.publicUrl;
              } catch (fileError) {
                console.error("File processing error:", fileError);
              }
            }
          }

          const customerData = {
            name,
            email,
            phone,
            address,
            dob,
            nationality,
            country,
            ...(photoUrl && { photo_url: photoUrl }),
          };

          const { data, error: insertError } = await supabase
            .from("customers")
            .insert([customerData])
            .select();

          if (insertError) throw insertError;

          res.status(201).json(data);
        } catch (error) {
          console.error("Error in POST handler:", error);
          res.status(500).json({
            error: error.message,
            details: "Failed to create customer record",
          });
        }
      });
      break;

      case "PUT":
        try {
          const form = new IncomingForm();
          form.parse(req, async (err, fields, files) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
  
            const updateId = query.id; // Get ID from query params
            if (!updateId) {
              res.status(400).json({ error: "ID is required for updates" });
              return;
            }
  
            // Extract fields, handling potential array values
            const updates = {
              name: fields.name?.[0] || fields.name || "",
              email: fields.email?.[0] || fields.email || "",
              phone: fields.phone?.[0] || fields.phone || "",
              address: fields.address?.[0] || fields.address || "",
              country: fields.country?.[0] || fields.country || "",
            };
  
            // Handle photo upload if present
            if (files.photo) {
              const file = Array.isArray(files.photo) ? files.photo[0] : files.photo;
              if (file && file.filepath) {
                try {
                  const fileData = fs.readFileSync(file.filepath);
                  const filePath = `public/${updates.name}_${Date.now()}_${file.originalFilename}`;
  
                  const { error: uploadError } = await supabase.storage
                    .from("customer-photos")
                    .upload(filePath, fileData, {
                      contentType: file.mimetype,
                      upsert: true
                    });
  
                  if (uploadError) throw uploadError;
  
                  const { data: publicURLData } = await supabase.storage
                    .from("customer-photos")
                    .getPublicUrl(filePath);
  
                  updates.photo_url = publicURLData.publicUrl;
                } catch (fileError) {
                  console.error("File processing error:", fileError);
                  res.status(500).json({ error: "Error processing file upload" });
                  return;
                }
              }
            }
  
            // Perform the update
            const { data: updatedData, error: updateError } = await supabase
              .from("customers")
              .update(updates)
              .eq("id", updateId)
              .select()
              .single();
  
            if (updateError) {
              res.status(500).json({ error: updateError.message });
              return;
            }
  
            res.status(200).json(updatedData);
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
        break;

    case "DELETE":
      try {
        const { id: deleteId } = query;

        const { data: customerData, error: fetchError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", deleteId)
          .single();
        if (fetchError) throw fetchError;

        const { data: deleteData, error: deleteError } = await supabase
          .from("customers")
          .delete()
          .eq("id", deleteId);
        if (deleteError) throw deleteError;

        res
          .status(200)
          .json({
            status: "success",
            message: "Customer deleted successfully.",
            data: customerData,
          });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", PUT, "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};

export default handler;