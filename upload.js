async function uploadImage(file) {
  const client = window.supabase.createClient(
    SITE_CONFIG.supabaseUrl,
    SITE_CONFIG.supabaseAnonKey
  );

  const fileName = Date.now() + "-" + file.name;

  const { error } = await client.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    alert("Upload failed: " + error.message);
    return null;
  }

  const { data } = client.storage
    .from("images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
