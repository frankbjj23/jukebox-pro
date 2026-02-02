import db from "#db/client";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import bcrypt from "bcrypt";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const SALT_ROUNDS = 10;

  const user1 = await createUser(
    "user1",
    await bcrypt.hash("password1", SALT_ROUNDS),
  );
  const user2 = await createUser(
    "user2",
    await bcrypt.hash("password2", SALT_ROUNDS),
  );

  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const playlist1 = await createPlaylist(
    "User 1 Playlist",
    "lorem ipsum playlist description",
    user1.id,
  );
  const playlist2 = await createPlaylist(
    "User 2 Playlist",
    "lorem ipsum playlist description",
    user2.id,
  );
  for (let trackId = 1; trackId <= 5; trackId++) {
    await createPlaylistTrack(playlist1.id, trackId);
  }
  for (let trackId = 6; trackId <= 10; trackId++) {
    await createPlaylistTrack(playlist2.id, trackId);
  }
}
