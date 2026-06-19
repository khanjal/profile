const LOCAL_ICON_URLS: Record<string, string> = {
  'c#': '/icons/vendor/csharp.svg',
  python: '/icons/vendor/python-colored.svg',
  javascript: '/icons/vendor/si-javascript.svg',
  typescript: '/icons/vendor/si-typescript.svg',
  'visual basic': '/icons/vendor/visualbasic.svg',
  php: '/icons/vendor/si-php.svg',
  perl: '/icons/vendor/si-perl.svg',
  asp: '/icons/vendor/asp.svg',
  'vb.net': '/icons/vendor/vbnet.svg',
  angular: '/icons/vendor/angular-colored.svg',
  jquery: '/icons/vendor/si-jquery.svg',
  'asp.net mvc': '/icons/vendor/asp-net-mvc.png',
  'asp.net': '/icons/vendor/aspnet.svg',
  bootstrap: '/icons/vendor/si-bootstrap.svg',
  tailwind: '/icons/vendor/si-tailwindcss.svg',
  aws: '/icons/aws-official/aws.svg',
  'google cloud': '/icons/vendor/googlecloud-colored.svg',
  azure: '/icons/vendor/azure.svg',
  lambda: '/icons/aws-official/lambda.svg',
  s3: '/icons/aws-official/s3.svg',
  'api gateway': '/icons/aws-official/api-gateway.svg',
  cloudwatch: '/icons/aws-official/cloudwatch.svg',
  'aws bedrock': '/icons/aws-official/aws-bedrock.svg',
  'ms sql': '/icons/vendor/mssql-devicon.svg',
  mysql: '/icons/vendor/si-mysql.svg',
  postgresql: '/icons/vendor/si-postgresql.svg',
  dynamodb: '/icons/aws-official/dynamodb.svg',
  microservices: '/icons/vendor/si-microdotblog.svg',
  'rest apis': '/icons/vendor/si-fastapi.svg',
  soap: '/icons/vendor/si-simpleicons.svg',
  ajax: '/icons/vendor/si-jquery.svg',
  xml: '/icons/vendor/si-xml.svg',
  git: '/icons/vendor/si-git.svg',
  jira: '/icons/vendor/si-jira.svg',
  'github actions': '/icons/vendor/si-githubactions.svg',
  circleci: '/icons/vendor/si-circleci.svg',
  proxmox: '/icons/vendor/si-proxmox.svg',
  unifi: '/icons/vendor/si-ubiquiti.svg',
  'pi-hole': '/icons/vendor/si-pihole.svg',
  dapper: '/icons/vendor/dapper.png',
  xunit: '/icons/vendor/xunit.png',
  jasmine: '/icons/vendor/si-jasmine.svg',
  karma: '/icons/vendor/karma.png',
  swagger: '/icons/vendor/si-swagger.svg',
  insomnia: '/icons/vendor/si-insomnia.svg',
  teamcity: '/icons/vendor/si-teamcity.svg',
  'octopus deploy': '/icons/vendor/si-octopusdeploy.svg',
  scrum: '/icons/vendor/scrum.svg',
  'alexa skills': '/icons/vendor/alexa.svg',
  biztalk: '/icons/vendor/mssql-devicon.svg',
  ssrs: '/icons/vendor/mssql-devicon.svg',
  'crystal reports': '/icons/vendor/si-sap.svg',
  svn: '/icons/vendor/si-subversion.svg',
  'github copilot': '/icons/vendor/si-githubcopilot.svg',
  claude: '/icons/vendor/si-claude.svg',
  'visual studio': '/icons/vendor/visualstudio.svg',
  'sql management studio': '/icons/vendor/sql-management-studio.png',
  'vs code': '/icons/vendor/vscode.svg',
  'jetbrains rider': '/icons/vendor/rider-colored.svg',
  npm: '/icons/vendor/si-npm.svg',
  '.net core': '/icons/vendor/dotnetcore.png',
  '.net framework': '/icons/vendor/dotnetframework.webp',
  xslt: '/icons/vendor/si-xml.svg',
  wsdl: '/icons/vendor/si-xml.svg',
  uml: '/icons/vendor/si-uml.svg',
  iis: '/icons/vendor/microsoft-iis.svg',
  sourcesafe: '/icons/vendor/si-git.svg',
  'node.js': '/icons/vendor/si-nodedotjs.svg'
};

function normalizeSkillName(skillName: string): string {
  return skillName.trim().toLowerCase();
}

export function getSkillIconUrl(skillName: string): string | null {
  const normalized = normalizeSkillName(skillName);
  return LOCAL_ICON_URLS[normalized] || null;
}

export function getSkillInitials(skillName: string): string {
  const tokens = skillName
    .replace(/[^a-zA-Z0-9.+#\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return '?';
  }

  if (tokens.length === 1) {
    const token = tokens[0];
    const short = token.replace(/[^a-zA-Z0-9+#]/g, '').slice(0, 3).toUpperCase();
    return short || token.slice(0, 3).toUpperCase();
  }

  const joined = tokens
    .slice(0, 3)
    .map(t => t[0])
    .join('')
    .toUpperCase();
  return joined;
}
