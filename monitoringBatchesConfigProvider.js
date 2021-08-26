const monitoringBatchesConfig = [
  {
    urls: {
      public: [
        "https://portal.uiic.in/GCWebPortal/login/LoginAction.do?p=login",
        "https://portal.uiic.in/GCWebPort/login/LoginAction.do?p=login",
      ],
      proxyRestricted: [],
    },
    recipientEmailAddresses: ["bar@example.com", "fab@example.com"],
    cronSchedule: "* * * * *",
    emailSubject: "Batch 1",
  },
  {
    urls: {
      public: [
        "https://github.com",
        "https://npmjs.com",
        "https://portal.uiic.in/GCWebPort/login/LoginAction.do?p=login",
      ],
      proxyRestricted: [],
    },
    recipientEmailAddresses: ["damn@example.com", "bam@example.com"],
    cronSchedule: "* * * * *",
    emailSubject: "Batch 2",
  },
];

module.exports = {
  monitoringBatchesConfig,
};
