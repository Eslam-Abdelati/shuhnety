const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const srcDir = path.resolve(__dirname, 'src');

walk(srcDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(file, 'utf8');
      
      const replacements = [
        // auth components
        { from: /@\/pages\/auth\/components\//g, to: '@/components/auth/' },
        { from: /@\/pages\/customer\/components\//g, to: '@/components/customer/' },
        { from: /(['"])\.\/components\/FileUpload(['"])/g, to: "'@/components/auth/FileUpload'" },
        { from: /(['"])\.\/components\/DashboardStats(['"])/g, to: "'@/components/customer/DashboardStats'" },
        // general case for any feature components that might have been there
        { from: /pages\/(.*?)\/components\//g, to: 'components/$1/' }
      ];

      let newContent = content;
      replacements.forEach(r => {
        newContent = newContent.replace(r.from, r.to);
      });

      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
      }
    }
  });
});
