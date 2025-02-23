const monitoringBatchesConfig = [
  {
    urls: {
      public: [
        "https://www.vcw.ac.in/",
        "https://www.vcw.ac.in/degree-exam-applications/",
        "https://www.vcw.ac.in/self-learning-exam-application/",
      ],
      proxyRestricted: [],
    },
    recipientEmailAddresses: ["admin@vcw.ac.in", "management@vcw.ac.in"],
    cronSchedule: "*/1 * * * *",
    emailSubject: "Batch 1",
  },
  {
    urls: {
      public: [
        "https://pay.velalarengg.ac.in/pay/",
      ],
      proxyRestricted: [],
    },
    recipientEmailAddresses: ["fees@vcw.ac.in", "management@vcw.ac.in"],
    cronSchedule: "*/1 * * * *",
    emailSubject: "Batch 2",
  },
];

module.exports = {
  monitoringBatchesConfig,
};
