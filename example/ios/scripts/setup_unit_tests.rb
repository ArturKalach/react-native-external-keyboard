#!/usr/bin/env ruby
require 'xcodeproj'
project_path = File.expand_path('../ExternalKeyboardExample.xcodeproj', __dir__)
project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == 'ExternalKeyboardExampleTests' }
abort('test target missing') unless target
group = project.main_group.find_subpath('ExternalKeyboardExampleTests', true)
group.set_source_tree('<group>')
group.set_path('ExternalKeyboardExampleTests')
existing = target.source_build_phase.files_references.map(&:path).compact
Dir[File.expand_path('../ExternalKeyboardExampleTests/*.mm', __dir__)].sort.each do |f|
  base = File.basename(f)
  next if existing.include?(base)
  ref = group.find_file_by_path(base) || group.new_reference(base)
  target.add_file_references([ref])
end
plist = group.find_file_by_path('Info.plist') || group.new_reference('Info.plist')
target.build_configurations.each do |config|
  bs = config.build_settings
  bs['PRODUCT_BUNDLE_IDENTIFIER'] = 'externalkeyboard.example.tests'
  defs = Array(bs['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)'])
  defs << '$(inherited)' unless defs.include?('$(inherited)')
  defs << 'RCT_NEW_ARCH_ENABLED=1' unless defs.include?('RCT_NEW_ARCH_ENABLED=1')
  bs['GCC_PREPROCESSOR_DEFINITIONS'] = defs
  bs['CLANG_ENABLE_MODULES'] = 'YES'
end
project.save
puts 'ExternalKeyboardExampleTests hydrated.'
