const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Organization = require("../models/Organization");
const Lead = require("../models/Lead");
const Client = require("../models/Client");
const Project = require("../models/Project");
const Invoice = require("../models/Invoice");
const Proposal = require("../models/Proposal");
const Agreement = require("../models/Agreement");
const Template = require("../models/Template");

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// ✅ Main Migration Function
const migrateToOrganization = async () => {
  try {
    console.log("\n🚀 Starting Migration to Organization-based System...\n");

    // Step 1: Find all users without organization
    const usersWithoutOrg = await User.find({
      organization: { $exists: false },
    });
    console.log(
      `📊 Found ${usersWithoutOrg.length} users without organization\n`
    );

    if (usersWithoutOrg.length === 0) {
      console.log(
        "✅ All users already have organizations. Migration complete!"
      );
      return;
    }

    let createdOrgs = 0;
    let updatedUsers = 0;
    let updatedLeads = 0;
    let updatedClients = 0;
    let updatedProjects = 0;
    let updatedInvoices = 0;
    let updatedProposals = 0;
    let updatedAgreements = 0;
    let updatedTemplates = 0;

    // Step 2: Process each user
    for (const user of usersWithoutOrg) {
      console.log(`\n👤 Processing User: ${user.name} (${user.email})`);

      // Create organization for this user
      const organization = await Organization.create({
        name: `${user.name}'s Organization`,
        owner: user._id,
        members: [user._id],
        createdAt: user.createdAt,
      });

      createdOrgs++;
      console.log(`   ✅ Created Organization: ${organization.name}`);

      // Update user with organization
      await User.findByIdAndUpdate(user._id, {
        organization: organization._id,
      });
      updatedUsers++;
      console.log(`   ✅ Updated User with organization`);

      // Update all data created by this user
      const orgUpdate = { organization: organization._id };

      // Update Leads
      const leadsResult = await Lead.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedLeads += leadsResult.modifiedCount;
      if (leadsResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${leadsResult.modifiedCount} Leads`);
      }

      // Update Clients
      const clientsResult = await Client.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedClients += clientsResult.modifiedCount;
      if (clientsResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${clientsResult.modifiedCount} Clients`);
      }

      // Update Projects
      const projectsResult = await Project.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedProjects += projectsResult.modifiedCount;
      if (projectsResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${projectsResult.modifiedCount} Projects`);
      }

      // Update Invoices
      const invoicesResult = await Invoice.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedInvoices += invoicesResult.modifiedCount;
      if (invoicesResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${invoicesResult.modifiedCount} Invoices`);
      }

      // Update Proposals
      const proposalsResult = await Proposal.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedProposals += proposalsResult.modifiedCount;
      if (proposalsResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${proposalsResult.modifiedCount} Proposals`);
      }

      // Update Agreements
      const agreementsResult = await Agreement.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedAgreements += agreementsResult.modifiedCount;
      if (agreementsResult.modifiedCount > 0) {
        console.log(
          `   ✅ Updated ${agreementsResult.modifiedCount} Agreements`
        );
      }

      // Update Templates
      const templatesResult = await Template.updateMany(
        { createdBy: user._id, organization: { $exists: false } },
        { $set: orgUpdate }
      );
      updatedTemplates += templatesResult.modifiedCount;
      if (templatesResult.modifiedCount > 0) {
        console.log(`   ✅ Updated ${templatesResult.modifiedCount} Templates`);
      }
    }

    // Step 3: Print Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Migration Summary:\n");
    console.log(`   Organizations Created:  ${createdOrgs}`);
    console.log(`   Users Updated:          ${updatedUsers}`);
    console.log(`   Leads Updated:          ${updatedLeads}`);
    console.log(`   Clients Updated:        ${updatedClients}`);
    console.log(`   Projects Updated:       ${updatedProjects}`);
    console.log(`   Invoices Updated:       ${updatedInvoices}`);
    console.log(`   Proposals Updated:      ${updatedProposals}`);
    console.log(`   Agreements Updated:     ${updatedAgreements}`);
    console.log(`   Templates Updated:      ${updatedTemplates}`);
    console.log("\n" + "=".repeat(60) + "\n");

    // Step 4: Verify Migration
    await verifyMigration();
  } catch (error) {
    console.error("\n❌ Migration Error:", error);
    throw error;
  }
};

// ✅ Verification Function
const verifyMigration = async () => {
  console.log("🔍 Verifying Migration...\n");

  try {
    // Check users without organization
    const usersWithoutOrg = await User.countDocuments({
      organization: { $exists: false },
    });

    // Check data without organization
    const leadsWithoutOrg = await Lead.countDocuments({
      organization: { $exists: false },
    });
    const clientsWithoutOrg = await Client.countDocuments({
      organization: { $exists: false },
    });
    const projectsWithoutOrg = await Project.countDocuments({
      organization: { $exists: false },
    });
    const invoicesWithoutOrg = await Invoice.countDocuments({
      organization: { $exists: false },
    });
    const proposalsWithoutOrg = await Proposal.countDocuments({
      organization: { $exists: false },
    });
    const agreementsWithoutOrg = await Agreement.countDocuments({
      organization: { $exists: false },
    });
    const templatesWithoutOrg = await Template.countDocuments({
      organization: { $exists: false },
    });

    console.log("📋 Verification Report:\n");
    console.log(`   Users without Org:      ${usersWithoutOrg}`);
    console.log(`   Leads without Org:      ${leadsWithoutOrg}`);
    console.log(`   Clients without Org:    ${clientsWithoutOrg}`);
    console.log(`   Projects without Org:   ${projectsWithoutOrg}`);
    console.log(`   Invoices without Org:   ${invoicesWithoutOrg}`);
    console.log(`   Proposals without Org:  ${proposalsWithoutOrg}`);
    console.log(`   Agreements without Org: ${agreementsWithoutOrg}`);
    console.log(`   Templates without Org:  ${templatesWithoutOrg}`);

    const totalWithoutOrg =
      usersWithoutOrg +
      leadsWithoutOrg +
      clientsWithoutOrg +
      projectsWithoutOrg +
      invoicesWithoutOrg +
      proposalsWithoutOrg +
      agreementsWithoutOrg +
      templatesWithoutOrg;

    if (totalWithoutOrg === 0) {
      console.log(
        "\n✅ Verification Passed! All data has organization assigned.\n"
      );
    } else {
      console.log(
        "\n⚠️  Warning: Some data still missing organization field.\n"
      );
    }

    // Show organization stats
    const totalOrgs = await Organization.countDocuments();
    console.log(`📊 Total Organizations: ${totalOrgs}\n`);
  } catch (error) {
    console.error("❌ Verification Error:", error);
  }
};

// ✅ Rollback Function (Optional - Use with caution!)
const rollbackMigration = async () => {
  try {
    console.log("\n⚠️  ROLLBACK: Removing organization references...\n");

    const userResult = await User.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${userResult.modifiedCount} users`
    );

    const leadResult = await Lead.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${leadResult.modifiedCount} leads`
    );

    const clientResult = await Client.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${clientResult.modifiedCount} clients`
    );

    const projectResult = await Project.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${projectResult.modifiedCount} projects`
    );

    const invoiceResult = await Invoice.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${invoiceResult.modifiedCount} invoices`
    );

    const proposalResult = await Proposal.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${proposalResult.modifiedCount} proposals`
    );

    const agreementResult = await Agreement.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${agreementResult.modifiedCount} agreements`
    );

    const templateResult = await Template.updateMany(
      {},
      { $unset: { organization: "" } }
    );
    console.log(
      `✅ Removed organization from ${templateResult.modifiedCount} templates`
    );

    // Delete all organizations
    const orgResult = await Organization.deleteMany({});
    console.log(`✅ Deleted ${orgResult.deletedCount} organizations`);

    console.log("\n✅ Rollback completed!\n");
  } catch (error) {
    console.error("❌ Rollback Error:", error);
  }
};

// ✅ Main Execution
const run = async () => {
  await connectDB();

  const command = process.argv[2];

  try {
    if (command === "rollback") {
      console.log("\n⚠️  WARNING: This will remove all organization data!");
      console.log("Press Ctrl+C to cancel or wait 5 seconds to continue...\n");

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await rollbackMigration();
    } else {
      await migrateToOrganization();
    }

    console.log("✅ Script completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  }
};

// Run the script
run();
