const { exec } = require("child_process");

exec(
  `ip -h -f inet -4 -j address | jq '.'`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error in command: ${stderr}`);
      return;
    }

    const ipAddresses = JSON.parse(stdout);

    const ip = ipAddresses
        .flatMap((ip) => ip.addr_info)
        .find(address => address.label.startsWith("eth"))
        ?.local
        ?? '127.0.0.1';
    
    console.log(ip);
  }
);
